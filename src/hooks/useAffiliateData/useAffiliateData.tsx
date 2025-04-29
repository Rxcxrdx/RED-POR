import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  affiliateGet,
  affiliateByNamePost,
  accountByAccountIdGet,
  affiliateByFondoIdGet,
  accountByAffiliateIdGet,
  accountByIdentificationNumber,
  accountByIdentificationIDPost,
  weeksByIdentificationNumber,
  getBalanceByAccountNumber,
} from "@/services";

import {
  IAffiliateRaw,
  UserDetailType,
  IPensionAccount,
  SelectedAffiliate,
  IAffiliateResponse,
  IFormattedAffiliate,
  IPensionAccountResponse,
  IFormattedPensionAccount,
} from "./IuseAffiliateData";
import { formatBalanceValue } from "@/common/utils";
import { Toast } from "pendig-fro-transversal-lib-react";
import { showCustomToast } from "@/components";

interface UseAffiliateConsultProps {
  form: UseFormReturn<any>;
  context: any;
}

export const useAffiliateData = ({
  form,
  context,
}: UseAffiliateConsultProps) => {
  const {
    accountData,
    setAccountData,
    pensionAccounts,
    setPensionAccounts,
    setCuentaId,
    balanceData,
    setUserDetail,
    setBalanceData,
    affiliateDetail,
    setAffiliateDetail,
    setSelectedContributions,
    registerFilterReset,
  } = context;

  const [affiliateConsultData, setAffiliateConsultData] = useState<
    IFormattedAffiliate[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isNameSearchModalOpen, setIsNameSearchModalOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] =
    useState<SelectedAffiliate | null>(null);

  const updateAccountDataWithBalanceTotals = (balanceData: any) => {
    const totalPesosObligatorio = balanceData.reduce(
      (sum: any, balance: any) => {
        const pesosValue = balance.pesosObligatorio
          ? parseFloat(balance.pesosObligatorio)
          : 0;
        return sum + pesosValue;
      },
      0
    );

    const formattedTotal = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(totalPesosObligatorio);

    setAccountData((prevAccountData: any) =>
      prevAccountData.map((account: any) => ({
        ...account,
        saldo: formattedTotal,
      }))
    );
    setUserDetail((prev: UserDetailType) => {
      if (!prev) return prev;
      return {
        ...prev,
        valorSaldoObligatorio: formattedTotal,
      };
    });
  };

  const mapToAffiliateDetail = (affiliateData: any, accountData?: any) => {
    const normalizeValue = (value: any) => (value === "null" ? null : value);

    const formatDate = (date: string | null) => {
      if (!date || date === "null") return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };

    const dateFields = [
      "fechaNacimiento",
      "fechaSiniestro",
      "ultimaLiquidacion",
      "fechaCreacion",
      "fechaModificacion",
    ];

    const processedAffiliate = Object.entries(affiliateData).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: dateFields.includes(key)
          ? formatDate(value as string)
          : normalizeValue(value),
      }),
      {}
    );

    return {
      numeroCuenta: accountData?.cuentaId || null,
      afiliado: processedAffiliate,
    };
  };

  const transformAccountData = (accounts: any[]): any[] => {
    return accounts.map((account) => {
      return {
        folio: account?.folio || "-",
        saldo: "-",
        estado: account.estadoAfiliadoFondoId,
        subestado: account.subestadoAfiliadoFondoId || "-",
        vinculacion: account.tipoVinculacion,
        tipoAfiliado: account.tipoAfiliado,
        valorUltimoPago: account.ultimoIbcPago
          ? account.ultimoIbcPago.toLocaleString("es-CO")
          : "-",
        fechaUltimoPago: account.ultimaFechaPago || "-",
        periodoUltimoPago: account.ultimoPeriodoPago || "-",
        nitUltimoPago: account.ultimoNitPago || "-",
        cuentaId: account.cuentaId,
        sarlaft: "-",
      };
    });
  };

  const transformAffiliateData = (
    afiliados: IAffiliateRaw[]
  ): IFormattedAffiliate[] => {
    const normalizeValue = (value: any) => {
      return value === "null" || value === null ? null : value;
    };

    return afiliados.map((afiliado) => ({
      nombreCompleto: [
        normalizeValue(afiliado.primerNombre),
        normalizeValue(afiliado.segundoNombre) || "",
        normalizeValue(afiliado.primerApellido),
        normalizeValue(afiliado.segundoApellido) || "",
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
      numeroIdentificacion: normalizeValue(afiliado.numeroIdentificacion),
      tipoIdentificacion: normalizeValue(afiliado.tipoIdentificacion),
      afiliadoFondoId: normalizeValue(afiliado.afiliadoFondoId),
      infoTabla: {
        fechaNacimiento: normalizeValue(afiliado.fechaNacimiento) || "-",
        genero:
          normalizeValue(afiliado.sexo) === "F" ? "Femenino" : "Masculino",
        registraduria:
          normalizeValue(afiliado.problemasRegistraduria) === "N" ? "No" : "Sí",
        sarlaft: normalizeValue(afiliado.sarlaft) || "-",
        transicion: normalizeValue(afiliado.transicion) || "-",
        ciudad: normalizeValue(afiliado.codigoCiudad) || "-",
        direccion: normalizeValue(afiliado.direccion) || "-",
        telefono: normalizeValue(afiliado.telefono) || "-",
        email: normalizeValue(afiliado.direccionEmail) || "-",
        ocupacion: normalizeValue(afiliado.ocupacionCargoActual) || "-",
        celular: normalizeValue(afiliado.celular) || "-",
        edad: normalizeValue(afiliado.edad) || "-",
      },
    }));
  };

  const transformPensionAccounts = (
    accounts: IPensionAccount[]
  ): IFormattedPensionAccount[] => {
    return accounts.map((cuenta) => ({
      fechaCreacion: cuenta.fechaCreacion,
      numeroCuenta: cuenta.numeroCuenta,
      estado: cuenta.estadoCuenta,
      subestado: cuenta.subEstadoCuenta,
    }));
  };

  const fetchBalanceByAccountId = async (cuentaId: any) => {
    if (!cuentaId) return;

    setIsLoading(true);
    try {
      const response = await getBalanceByAccountNumber(cuentaId);
      if (response?.status?.statusCode === 200) {
        const { saldos: balances } = response.data;
        if (balances) {
          setBalanceData(balances);
          updateAccountDataWithBalanceTotals(balances);
        }
      }
    } catch (error) {
      console.error("Error al obtener saldos por cuenta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNameSearchData = async (page: number, pageSize: number) => {
    const { primerNombre, primerApellido, segundoNombre, segundoApellido } =
      form.getValues();

    try {
      const response = await affiliateByNamePost({
        primerNombre: primerNombre.toUpperCase(),
        primerApellido: primerApellido.toUpperCase(),
        segundoNombre: segundoNombre ? segundoNombre.toUpperCase() : null,
        segundoApellido: segundoApellido ? segundoApellido.toUpperCase() : null,
        page: {
          page: page,
          size: pageSize,
        },
      });
      return response;
    } catch (error) {
      console.error("Error en búsqueda por nombre:", error);
      throw error;
    }
  };

  const fetchBalanceData = async (
    numeroIdentificacion: string,
    tipoIdentificacion: string
  ) => {
    try {
      const payload = {
        consultarSaldosRequest: {
          tipoId: tipoIdentificacion,
          numeroId: numeroIdentificacion,
        },
      };

      const response = await accountByIdentificationIDPost(payload);

      if ((response as any)?.consultarSaldosResponse) {
        const balanceData = (response as any).consultarSaldosResponse;

        setPensionAccounts((prevAccounts: any) => {
          return prevAccounts.map((account: any) => ({
            ...account,
            semanas: "-",
            saldoMenor23SMLV: formatBalanceValue(
              balanceData.subSaldoAfpAportesMenorIgual23
            ),
            saldoMayor23SMLV: formatBalanceValue(
              balanceData.subSaldoAfpAportesSuperior23
            ),
          }));
        });
      }
    } catch (error) {
      console.error("Error en fetchBalanceData:", error);
    }
  };

  const fetchPensionAccounts = async (
    numeroIdentificacion: string,
    tipoIdentificacion: string
  ) => {
    try {
      const response = (await accountByIdentificationNumber(
        numeroIdentificacion,
        tipoIdentificacion
      )) as IPensionAccountResponse;

      if (response?.data?.cuentasPensionesObligatorias) {
        setPensionAccounts(
          transformPensionAccounts(response.data.cuentasPensionesObligatorias)
        );
      } else {
        setPensionAccounts([]);
      }
    } catch (error) {
      console.error("Error en fetchPensionAccounts:", error);
      setPensionAccounts([]);
    }
  };

  const fetchAccountByAffiliateId = async (afiliadoFondoId: string) => {
    try {
      const response = await accountByAffiliateIdGet(afiliadoFondoId);

      if (response?.data?.account) {
        const formattedData = transformAccountData(response.data.account);
        setAccountData(formattedData);

        const cuentaId = response.data.account[0]?.cuentaId;
        setCuentaId(cuentaId ?? null);

        if (cuentaId) {
          await fetchBalanceByAccountId(cuentaId);
        }

        setAffiliateDetail((prev: any) =>
          prev ? { ...prev, numeroCuenta: cuentaId } : null
        );

        setUserDetail((prev: UserDetailType) => {
          if (!prev) return prev;
          return {
            ...prev,
            estadoAfiliado: formattedData[0]?.estado || "-",
            subestadoAfiliado: formattedData[0]?.subestado || "-",
            numeroCuenta: formattedData[0]?.cuentaId || "-",
            ultimoIbcPago: response.data.account[0]?.ultimoIbcPago || "-",
            razonSocial: response.data.account[0]?.razonSocial || "-",
            folio: response.data.account[0]?.folio || "-",
            vinculacion: response.data.account[0]?.tipoVinculacion,
            ultimaFechaPago: response.data.account[0]?.ultimaFechaPago || "-",
            ultimoPeriodoPago:
              response.data.account[0]?.ultimoPeriodoPago || "-",
            tipoAfiliado: response.data.account[0]?.tipoAfiliado || "-",
            tipoVinculacion: response.data.account[0]?.tipoVinculacion || "-",
            fechaSolicitud: response.data.account[0]?.fechaSolicitud || "-",
            fechaIngresoPorvenir:
              response.data.account[0]?.fechaIngresoPorvenir || "-",
          };
        });
      } else {
        setAccountData([]);
        setCuentaId(null);
      }
    } catch (error) {
      console.error("Error al llamar al servicio de cuentas:", error);
      setAccountData([]);
      setCuentaId(null);
      setAffiliateDetail(null);
    }
  };

  const fetchWeeksByIdentificationNumber = async (
    numeroIdentificacion: string,
    tipoIdentificacion: string
  ) => {
    try {
      const response = await weeksByIdentificationNumber(
        numeroIdentificacion,
        tipoIdentificacion
      );

      if (response?.status?.statusCode === 200) {
        const responseData = response.data as unknown as {
          consultarSemanasCotizadasResponses: Array<{
            semanasTransicion: string;
            semanasOportunidad: string;
            esTransicion: string;
            esOportunidad: string;
            genero: string;
            estadoCuenta: string;
            fechaNacimiento: string;
            anosPension: number;
          }>;
        };

        if (responseData?.consultarSemanasCotizadasResponses?.length > 0) {
          const weekData = responseData.consultarSemanasCotizadasResponses[0];

          setPensionAccounts((prevAccounts: any) => {
            return prevAccounts.map((account: any) => ({
              ...account,
              semanas: weekData.semanasOportunidad || "-",
              esTransicion: weekData.esTransicion,
              esOportunidad: weekData.esOportunidad,
              anosPension: weekData.anosPension,
            }));
          });
        }
      }
    } catch (error) {
      console.error("Error en fetchWeeksByIdentificationNumber:", error);
    }
  };

  const fetchAffiliateData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { numeroCuenta, numeroIdentificacion, tipoIdentificacion } =
      form.getValues();

    if (!numeroIdentificacion || !tipoIdentificacion) {
      setErrorMessage(
        "Debe ingresar número y tipo de identificación o un número de cuenta."
      );
      setIsLoading(false);
      Toast.showStatusCode(400);
      return;
    }

    try {
      const response = (await affiliateGet({
        numeroCuenta,
        numeroIdentificacion,
        tipoIdentificacion,
      })) as IAffiliateResponse;

      if (response?.status?.statusCode === 200 && response?.data?.afiliado) {
        const formattedData = transformAffiliateData(response.data.afiliado);
        setAffiliateConsultData(formattedData);

        setAffiliateDetail(mapToAffiliateDetail(response.data.afiliado[0]));

        if (formattedData[0]) {
          setUserDetail({
            ...formattedData[0],
            estadoAfiliado: "-",
            subestadoAfiliado: "-",
            numeroCuenta: "-",
            barrio: response.data.afiliado[0]?.barrio || "-",
            codigoCiudad: response.data.afiliado[0]?.codigoCiudad || "-",
            ultimaFechaPago: response.data.afiliado[0]?.ultimaFechaPago || "-",
            ultimoPeriodoPago:
              response.data.afiliado[0]?.ultimoPeriodoPago || "-",
          });
        }

        const afiliadoFondoId = formattedData[0]?.afiliadoFondoId;
        if (afiliadoFondoId) {
          await fetchAccountByAffiliateId(afiliadoFondoId);
        }

        if (numeroIdentificacion && tipoIdentificacion) {
          await fetchPensionAccounts(numeroIdentificacion, tipoIdentificacion);
          await fetchBalanceData(numeroIdentificacion, tipoIdentificacion);
          await fetchWeeksByIdentificationNumber(
            numeroIdentificacion,
            tipoIdentificacion
          );
        }
      } else {
        setAffiliateConsultData([]);
        setAccountData([]);
        setPensionAccounts([]);
        setErrorMessage("No se encontraron datos.");
        showCustomToast("noResults");
      }
    } catch (error) {
      console.error("Error en fetchAffiliateData:", error);
      setErrorMessage("Error al consultar.");
      setAffiliateDetail(null);
      Toast.showStatusCode(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = async () => {
    const {
      primerNombre,
      numeroCuenta,
      primerApellido,
      tipoIdentificacion,
      numeroIdentificacion,
    } = form.getValues();

    setIsLoading(true);
    setErrorMessage("");
    setCuentaId(null);
    setUserDetail(null);
    setAffiliateDetail(null);
    setAffiliateConsultData([]);
    setAccountData([]);
    setPensionAccounts([]);
    setSelectedAffiliate(null);
    setSelectedContributions([]);
    setBalanceData(null);

    try {
      if (primerNombre && primerApellido) {
        setIsNameSearchModalOpen(true);
        return;
      }

      if (numeroCuenta) {
        const accountResponse = await accountByAccountIdGet(numeroCuenta);

        if (accountResponse?.status?.statusCode === 200) {
          const { account } = accountResponse.data;

          if (account?.length > 0) {
            const formattedAccounts = transformAccountData(account);
            setAccountData(formattedAccounts);

            const cuentaId = account[0]?.cuentaId;
            if (cuentaId) {
              setCuentaId(cuentaId);
              await fetchBalanceByAccountId(cuentaId);
            }

            const afiliadoFondoId = account[0]?.afiliadoFondoId?.toString();
            if (afiliadoFondoId) {
              const affiliateResponse = (await affiliateByFondoIdGet(
                afiliadoFondoId
              )) as IAffiliateResponse;

              if (
                affiliateResponse?.status?.statusCode === 200 &&
                affiliateResponse.data?.afiliado
              ) {
                const formattedAffiliateData = transformAffiliateData(
                  affiliateResponse.data.afiliado
                );
                setAffiliateConsultData(formattedAffiliateData);

                if (formattedAffiliateData[0]) {
                  setUserDetail({
                    ...formattedAffiliateData[0],
                    estadoAfiliado: formattedAccounts[0]?.estado || "-",
                    subestadoAfiliado: formattedAccounts[0]?.subestado || "-",
                    numeroCuenta: formattedAccounts[0]?.cuentaId || "-",
                    ultimoIbcPago: account[0]?.ultimoIbcPago || "-",
                    razonSocial: account[0]?.razonSocial || "-",
                    barrio: affiliateResponse.data.afiliado[0]?.barrio || "-",
                    codigoCiudad:
                      affiliateResponse.data.afiliado[0]?.codigoCiudad || "-",
                    folio: account[0]?.folio || "-",
                    vinculacion: account[0]?.tipoVinculacion,
                    ultimaFechaPago: account[0]?.ultimaFechaPago || "-",
                    ultimoPeriodoPago: account[0]?.ultimoPeriodoPago || "-",
                    tipoAfiliado: account[0]?.tipoAfiliado || "-",
                    tipoVinculacion: account[0]?.tipoVinculacion || "-",
                    fechaSolicitud: account[0]?.fechaSolicitud || "-",
                    fechaIngresoPorvenir:
                      account[0]?.fechaIngresoPorvenir || "-",
                  });
                }

                const {
                  numeroIdentificacion: numId,
                  tipoIdentificacion: tipoId,
                } = affiliateResponse.data.afiliado[0];

                setAffiliateDetail(
                  mapToAffiliateDetail(
                    affiliateResponse.data.afiliado[0],
                    accountResponse.data.account[0]
                  )
                );

                if (numId && tipoId) {
                  await fetchPensionAccounts(numId, tipoId);
                  await fetchBalanceData(numId, tipoId);
                  await fetchWeeksByIdentificationNumber(numId, tipoId);
                }
              }
            }
          } else {
            setErrorMessage(
              "No se encontraron datos para la cuenta ingresada."
            );
            setCuentaId(null);
            showCustomToast("noResults");
          }
        } else {
          setErrorMessage("No se encontraron datos para la cuenta ingresada.");
          setCuentaId(null);
          showCustomToast("noResults");
        }
      } else if (numeroIdentificacion && tipoIdentificacion) {
        await fetchAffiliateData();
      } else {
        setErrorMessage(
          "Debe ingresar el número de cuenta o el número y tipo de identificación."
        );
        setCuentaId(null);
        Toast.showStatusCode(400);
      }
    } catch (error) {
      console.error("Error en handleFilterSubmit:", error);
      setErrorMessage("Ocurrió un error al realizar la consulta.");
      setCuentaId(null);
      setAffiliateDetail(null);
      Toast.showStatusCode(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterReset = () => {
    form.reset();
    setCuentaId(null);
    setAffiliateConsultData([]);
    setAccountData([]);
    setPensionAccounts([]);
    setErrorMessage("");
    setUserDetail(null);
    setSelectedAffiliate(null);
    setAffiliateDetail(null);
    setSelectedContributions([]);
    setBalanceData(null);
  };

  const onCloseNameSearchModal = () => {
    setIsNameSearchModalOpen(false);
  };

  useEffect(() => {
    registerFilterReset(handleFilterReset);
  }, [registerFilterReset]);

  useEffect(() => {
    if (balanceData && balanceData.length > 0) {
      updateAccountDataWithBalanceTotals(balanceData);
    }
  }, [balanceData]);

  useEffect(() => {
    const fetchSelectedAffiliateData = async () => {
      if (selectedAffiliate) {
        setIsNameSearchModalOpen(false);
        setIsLoading(true);
        setErrorMessage("");

        try {
          const affiliateResponse = (await affiliateByFondoIdGet(
            selectedAffiliate?.afiliadoFondoId
          )) as any;

          if (
            affiliateResponse?.status?.statusCode === 200 &&
            affiliateResponse?.data?.afiliado
          ) {
            const formattedAffiliateData = transformAffiliateData(
              affiliateResponse?.data?.afiliado
            );
            setAffiliateConsultData(formattedAffiliateData);

            if (formattedAffiliateData[0]) {
              setUserDetail({
                ...formattedAffiliateData[0],
                estadoAfiliado: "-",
                subestadoAfiliado: "-",
                numeroCuenta: "-",
                barrio: affiliateResponse.data.afiliado[0]?.barrio || "-",
                codigoCiudad:
                  affiliateResponse.data.afiliado[0]?.codigoCiudad || "-",
                ultimaFechaPago:
                  affiliateResponse.data.afiliado[0]?.ultimaFechaPago || "-",
                ultimoPeriodoPago:
                  affiliateResponse.data.afiliado[0]?.affiliateResponse || "-",
              });
            }

            const accountResponse = await accountByAffiliateIdGet(
              selectedAffiliate.afiliadoFondoId
            );

            if (accountResponse?.data?.account) {
              const formattedAccounts = transformAccountData(
                accountResponse.data.account
              );
              setAccountData(formattedAccounts);

              const cuentaId = accountResponse.data.account[0]?.cuentaId;
              if (cuentaId) {
                setCuentaId(cuentaId);
                await fetchBalanceByAccountId(cuentaId);
              }
              setAffiliateDetail(
                mapToAffiliateDetail(
                  affiliateResponse.data.afiliado[0],
                  accountResponse.data.account[0]
                )
              );

              setUserDetail((prev: UserDetailType) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  estadoAfiliado: formattedAccounts[0]?.estado || "-",
                  subestadoAfiliado: formattedAccounts[0]?.subestado || "-",
                  numeroCuenta: formattedAccounts[0]?.cuentaId || "-",
                  ultimoIbcPago:
                    accountResponse.data.account[0]?.ultimoIbcPago || "-",
                  razonSocial:
                    accountResponse.data.account[0]?.razonSocial || "-",
                  folio: accountResponse.data.account[0]?.folio || "-",
                  vinculacion:
                    accountResponse.data.account[0]?.tipoVinculacion || "-",
                  ultimaFechaPago:
                    accountResponse.data.account[0]?.ultimaFechaPago || "-",
                  ultimoPeriodoPago:
                    accountResponse.data.account[0]?.ultimoPeriodoPago || "-",
                  tipoAfiliado:
                    accountResponse.data.account[0]?.tipoAfiliado || "-",
                  tipoVinculacion:
                    accountResponse.data.account[0]?.tipoVinculacion || "-",
                  fechaSolicitud:
                    accountResponse.data.account[0]?.fechaSolicitud || "-",
                  fechaIngresoPorvenir:
                    accountResponse.data.account[0]?.fechaIngresoPorvenir ||
                    "-",
                };
              });
            }
            await fetchPensionAccounts(
              selectedAffiliate.identificacion,
              selectedAffiliate.tipoId
            );
            await fetchBalanceData(
              selectedAffiliate.identificacion,
              selectedAffiliate.tipoId
            );
            await fetchWeeksByIdentificationNumber(
              selectedAffiliate.identificacion,
              selectedAffiliate.tipoId
            );
          }
        } catch (error) {
          console.error(
            "Error al obtener datos del afiliado seleccionado:",
            error
          );
          setErrorMessage("Error al consultar los datos del afiliado.");
          setAccountData([]);
          setCuentaId(null);
          setAffiliateDetail(null);
          Toast.showStatusCode(500);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSelectedAffiliateData();
  }, [selectedAffiliate]);

  return {
    isLoading,
    accountData,
    errorMessage,
    affiliateDetail,
    pensionAccounts,
    selectedAffiliate,
    affiliateConsultData,
    isNameSearchModalOpen,
    getNameSearchData,
    handleFilterReset,
    handleFilterSubmit,
    setSelectedAffiliate,
    onCloseNameSearchModal,
    setIsNameSearchModalOpen,
  };
};
