import React, { useState, useEffect } from "react";
import {
  Card,
  Enfasis,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";

interface AccountData {
  [key: string]: any;
}

interface AccountCardProps {
  accountData: AccountData[];
  onAccountSelect?: (accountId: string) => void;
  accountTitle?: string;
  idField?: string;
  hiddenFields?: string[];
}

export const AccountFdogenCard: React.FC<AccountCardProps> = ({
  accountData,
  onAccountSelect,
  accountTitle = "CUENTA ID",
  idField = "Cuenta ID",
  hiddenFields = [],
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const isValidAccountData =
    Array.isArray(accountData) && accountData.length > 0;

  const accountOptions = isValidAccountData
    ? accountData.map((account, index) => ({
        value: index.toString(),
        label: `${idField}: ${account[idField] || "N/A"}`,
      }))
    : [];

  useEffect(() => {
    if (isValidAccountData) {
      setSelectedAccount("0");
      const initialAccountData = accountData[0];
      if (initialAccountData?.[idField]) {
        onAccountSelect?.(initialAccountData[idField]);
      }
    }
  }, [accountData, isValidAccountData, idField, onAccountSelect]);

  useEffect(() => {
    if (selectedAccount !== null && isValidAccountData) {
      const selectedAccountData = accountData[parseInt(selectedAccount)];
      if (selectedAccountData?.[idField]) {
        onAccountSelect?.(selectedAccountData[idField]);
      }
    }
  }, [
    selectedAccount,
    isValidAccountData,
    accountData,
    idField,
    onAccountSelect,
  ]);

  const selectedAccountData =
    isValidAccountData && selectedAccount !== null
      ? accountData[parseInt(selectedAccount)]
      : null;

  const rows =
    selectedAccountData && Object.keys(selectedAccountData).length > 0
      ? Object.entries(selectedAccountData)
          .filter(([key]) => !hiddenFields.includes(key))
          .map(([key, value]) => ({
            atributo: key,
            valor: value ? String(value) : "-",
            uniqueId: `${key}-${value || "NA"}`,
          }))
      : [];

  const accountLength = isValidAccountData ? accountData.length : 0;

  // Obtener el ID de la cuenta seleccionada de forma segura
  const displayAccountId =
    isValidAccountData && selectedAccountData
      ? selectedAccountData[idField] ?? "-"
      : "-";

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
          <Enfasis fontWeight={700} data-testid="selected-account-display">
            {`${accountTitle}: ${displayAccountId}`}
          </Enfasis>

          {accountLength > 1 && (
            <select
              style={{
                width: "200px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              value={selectedAccount || ""}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Selecciona una cuenta</option>
              {accountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div style={{ width: "100%", padding: "0px 16px 16px 16px" }}>
        {rows.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.uniqueId}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor:
                      rows.indexOf(row) % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <Enfasis fontWeight={600}>{row.atributo}</Enfasis>
                  </td>
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <ParagraphNormal>{row.valor}</ParagraphNormal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ParagraphNormal>No hay datos para mostrar.</ParagraphNormal>
        )}
      </div>
    </div>
  );
};
