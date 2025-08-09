import { useState } from "react";
import "./case.css";

function CasePage() {
  const [caseNumber, setCaseNumber] = useState("");
  const [caseType, setCaseType] = useState("ARB.P.");
  const [caseYear, setCaseYear] = useState(new Date().getFullYear());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const caseTypes = [
    "",
    "ADMIN.REPORT",
    "ARB.A.",
    "ARB. A. (COMM.)",
    "ARB.P.",
    "BAIL APPLN.",
    "CA",
    "CA (COMM.IPD-CR)",
    "C.A.(COMM.IPD-GI)",
    "C.A.(COMM.IPD-PAT)",
    "C.A.(COMM.IPD-PV)",
    "C.A.(COMM.IPD-TM)",
    "CAVEAT(CO.)",
    "CC(ARB.)",
    "CCP(CO.)",
    "CCP(REF)",
    "CEAC",
    "CEAR",
    "CHAT.A.C.",
    "CHAT.A.REF",
    "CMI",
    "CM(M)",
    "CM(M)-IPD",
    "C.O.",
    "CO.APP.",
    "CO.APPL.(C)",
    "CO.APPL.(M)",
    "CO.A(SB)",
    "C.O.(COMM.IPD-CR)",
    "C.O.(COMM.IPD-GI)",
    "C.O.(COMM.IPD-PAT)",
    "C.O. (COMM.IPD-TM)",
    "CO.EX.",
    "CONT.APP.(C)",
    "CONT.CAS(C)",
    "CONT.CAS.(CRL)",
    "CO.PET.",
    "C.REF.(O)",
    "CRL.A.",
    "CRL.L.P.",
    "CRL.M.C.",
    "CRL.M.(CO.)",
    "CRL.M.I.",
    "CRL.O.",
    "CRL.O.(CO.)",
    "CRL.REF.",
    "CRL.REV.P.",
    "CRL.REV.P.(MAT.)",
    "CRL.REV.P.(NDPS)",
    "CRL.REV.P.(NI)",
    "C.R.P.",
    "CRP-IPD",
    "C.RULE",
    "CS(COMM)",
    "CS(OS)",
    "CS(OS) GP",
    "CUSAA",
    "CUS.A.C.",
    "CUS.A.R.",
    "CUSTOM A.",
    "DEATH SENTENCE REF.",
    "DEMO",
    "EDC",
    "EDR",
    "EFA(COMM)",
    "EFA(OS)",
    "EFA(OS)  (COMM)",
    "EFA(OS)(IPD)",
    "EL.PET.",
    "ETR",
    "EX.F.A.",
    "EX.P.",
    "EX.S.A.",
    "FAO",
    "FAO (COMM)",
    "FAO-IPD",
    "FAO(OS)",
    "FAO(OS) (COMM)",
    "FAO(OS)(IPD)",
    "GCAC",
    "GCAR",
    "GTA",
    "GTC",
    "GTR",
    "I.A.",
    "I.P.A.",
    "ITA",
    "ITC",
    "ITR",
    "ITSA",
    "LA.APP.",
    "LPA",
    "MAC.APP.",
    "MAT.",
    "MAT.APP.",
    "MAT.APP.(F.C.)",
    "MAT.CASE",
    "MAT.REF.",
    "MISC. APPEAL(PMLA)",
    "OA",
    "OCJA",
    "O.M.P.",
    "O.M.P. (COMM)",
    "OMP (CONT.)",
    "O.M.P. (E)",
    "O.M.P. (E) (COMM.)",
    "O.M.P.(EFA)(COMM.)",
    "OMP (ENF.) (COMM.)",
    "O.M.P.(I)",
    "O.M.P.(I) (COMM.)",
    "O.M.P. (J) (COMM.)",
    "O.M.P. (MISC.)",
    "O.M.P.(MISC.)(COMM.)",
    "O.M.P.(T)",
    "O.M.P. (T) (COMM.)",
    "O.REF.",
    "RC.REV.",
    "RC.S.A.",
    "RERA APPEAL",
    "REVIEW PET.",
    "RFA",
    "RFA(COMM)",
    "RFA-IPD",
    "RFA(OS)",
    "RFA(OS)(COMM)",
    "RF(OS)(IPD)",
    "RSA",
    "SCA",
    "SDR",
    "SERTA",
    "ST.APPL.",
    "STC",
    "ST.REF.",
    "SUR.T.REF.",
    "TEST.CAS.",
    "TR.P.(C)",
    "TR.P.(C.)",
    "TR.P.(CRL.)",
    "VAT APPEAL",
    "W.P.(C)",
    "W.P.(C)-IPD",
    "WP(C)(IPD)",
    "W.P.(CRL)",
    "WTA",
    "WTC",
    "WTR",
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const response = await fetch("http://localhost:3000/get-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseNumber: parseInt(caseNumber),
          caseType,
          caseYear: parseInt(caseYear),
        }),
      });

      if (response.status === 404) {
        const { message } = await response.json();
        setError(message);
        return;
      }
      if (response.status === 400) {
        const { message } = await response.json();
        setError(message);
        return;
      }

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError("Failed to fetch Information");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Case Search</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Case Number"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
        />

        <select value={caseType} onChange={(e) => setCaseType(e.target.value)}>
          {caseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select value={caseYear} onChange={(e) => setCaseYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result">
          <h3>Case Details</h3>

          <table className="case-info">
            <tbody>
              <tr>
                <th>Petitioner</th>
                <td>{result.petitioner}</td>
              </tr>
              <tr>
                <th>Respondent</th>
                <td>{result.respondent}</td>
              </tr>
              {result.lastHearingDate && (
                <tr>
                  <th>Last Hearing Date</th>
                  <td>{result.lastHearingDate}</td>
                </tr>
              )}
              {result.nextDate && (
                <tr>
                  <th>Next Hearing Date</th>
                  <td>{result.nextDate}</td>
                </tr>
              )}
            </tbody>
          </table>

          <h4 style={{ marginTop: "30px" }}>Order History</h4>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {result.orders?.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderDate}</td>
                  <td>
                    <a
                      href={order.orderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CasePage;
