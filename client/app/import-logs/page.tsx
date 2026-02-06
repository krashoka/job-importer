"use client";

import { useEffect, useState } from "react";
import { fetchImportLogs } from "../services/api";

export default function ImportLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchImportLogs(page, 10)
      .then((res) => {
        setLogs(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);
  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
        {/* Header */}
        <h2 style={{ marginBottom: "16px" }}>Import History Tracking</h2>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th style={th}>File Name</th>
                <th style={th}>Import Time</th>
                <th style={th}>Total</th>
                <th style={th}>New</th>
                <th style={th}>Updated</th>
                <th style={th}>Failed</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "16px" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "16px" }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td style={td}>{log.fileName}</td>
                    <td style={td}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={tdCenter}>{log.totalFetched}</td>
                    <td style={tdCenter}>{log.newJobs}</td>
                    <td style={tdCenter}>{log.updatedJobs}</td>
                    <td style={tdCenter}>{log.failedJobs.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
  );
}



/* ---------- styles ---------- */

const th: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "14px",
};

const td: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  fontSize: "13px",
};

const tdCenter: React.CSSProperties = {
  ...td,
  textAlign: "center",
};