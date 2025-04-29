import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Enfasis,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";

interface IFormattedPensionAccount {
  "Número de Cuenta": string | number;
  [key: string]: any;
}

interface AccountMultifondCardProps {
  pensionAccounts: IFormattedPensionAccount[];
}

export const AccountMultifondCard: React.FC<AccountMultifondCardProps> = ({
  pensionAccounts,
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<IFormattedPensionAccount | null>(null);

  useEffect(() => {
    if (pensionAccounts.length > 0) {
      setSelectedAccount(pensionAccounts[0]);
    }
  }, [pensionAccounts]);

  const rows =
    selectedAccount && pensionAccounts.length > 0
      ? Object.entries(selectedAccount).map(([key, value], index) => {
          let formattedValue = value;
          if (
            key.toLowerCase().includes("fecha") &&
            typeof value === "string"
          ) {
            formattedValue = dayjs(value).isValid()
              ? dayjs(value).format("DD/MM/YYYY")
              : "invalid-date";
          }
          return { id: index, atributo: key, valor: formattedValue || "-" };
        })
      : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: "8px",
        border: "1px solid #c9df8a",
        height: "auto",
      }}
    >
      <div style={{ width: "100%", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Enfasis fontWeight={700} data-testid="selected-account">
            CUENTA 100: {selectedAccount?.["Número de Cuenta"] || "-"}
          </Enfasis>

          {pensionAccounts.length > 1 && (
            <select
              value={selectedAccount?.["Número de Cuenta"] || ""}
              onChange={(e) =>
                setSelectedAccount(
                  pensionAccounts.find(
                    (account) =>
                      account["Número de Cuenta"].toString() === e.target.value
                  ) || null
                )
              }
              style={{
                marginLeft: "16px",
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              data-testid="account-select"
            >
              {pensionAccounts.map((account) => (
                <option
                  key={account["Número de Cuenta"]}
                  value={account["Número de Cuenta"].toString()}
                >
                  Cuenta ID: {account["Número de Cuenta"]}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div style={{ width: "100%", padding: "0px 16px 16px 16px" }}>
        {rows.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
            data-testid="data-table"
          >
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <Enfasis
                      fontWeight={600}
                      data-testid={`atributo-${row.id}`}
                    >
                      {row.atributo}
                    </Enfasis>
                  </td>
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <ParagraphNormal data-testid={`valor-${row.id}`}>
                      {row.valor}
                    </ParagraphNormal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ParagraphNormal data-testid="no-data">
            No hay datos para mostrar.
          </ParagraphNormal>
        )}
      </div>
    </div>
  );
};
