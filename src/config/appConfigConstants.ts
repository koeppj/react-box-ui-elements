export const contractTemplateSrc = {
    scope: 'enterprise',
    displayName: "Contract",
    templateKey: "contract",
    fields: [
      {
        type: 'string',
        key: "externalPartyName",
        displayName: "External Party Name",
        hidden: false
      },
      {
        type: "enum",
        key: "contractType",
        displayName: "Contract Type",
        hidden: false,
        options: [
          { key: "Amendment" },
          { key: "Sales Agreement" },
          { key: "Non Disclosure Agreement" },
          { key: "Master Agreement" }
        ]
      },
      {
        type: "date",
        key: "endDate",
        displayName: "End Date",
        hidden: false
      },
      {
        type: "enum",
        key: "autoRenew",
        displayName: "Auto Renew",
        hidden: false,
        options: [
          { key: "No" },
          { key: "Yes" }
        ]
      },
      {
        type: "enum",
        key: "lawyer",
        displayName: "Lawyer",
        hidden: false,
        options: [
          { key: "Karl Jones" },
          { key: "Tony Clark" },
          { key: "Darren Daniels" },
          { key: "Erica Adams" }
        ]
      },
      {
        type: "enum",
        key: "riskLevel",
        displayName: "Risk Level",
        hidden: false,
        options: [
          { key: "Normal" },
          { key: "Extreme" }
        ]
      }
    ]
};

export const documentTemplateSrc = {
    scope: 'enterprise',
    displayName: "Contract Document",
    templateKey: "contractDocument",
    fields: [
      {
        type: 'enum',
        key: "documentType",
        displayName: "Document Type",
        hidden: false,
        options: [
          { key: "Contract" },
          { key: "Letter of Intent" },
          { key: "Term Sheet" },
          { key: "NDA" },
          { key: "Side Letter" },
          { key: "Due Dilligence Report" },
        ]
      },
      {
        type: "enum",
        key: "status",
        displayName: "Status",
        hidden: false,
        options: [
          { key: "Draft" },
          { key: "In Review" },
          { key: "Approved" },
          { key: "Executed" }
        ]
      }
    ]
};

export const rootFolderName = "Contracts";