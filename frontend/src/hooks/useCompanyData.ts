import { useQuery } from "@tanstack/react-query";
import { getReportForCompany, PlatformReport } from "../mock/mockData";

// Simulated fetch function with artificial delay to mock backend APIs
const fetchCompanyReport = async (query: string): Promise<PlatformReport> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const report = getReportForCompany(query);
        resolve(report);
      } catch (err) {
        reject(new Error("Failed to load company metrics. Ticker not found."));
      }
    }, 1200); // 1.2 second network delay simulation
  });
};

export function useCompanyData(query: string) {
  return useQuery<PlatformReport, Error>({
    queryKey: ["companyReport", query],
    queryFn: () => fetchCompanyReport(query),
    enabled: !!query,
    retry: 1,
    refetchOnWindowFocus: false
  });
}
