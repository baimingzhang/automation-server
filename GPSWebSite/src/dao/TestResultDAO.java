package dao;

import java.util.List;

public interface TestResultDAO {
	List<TestResult> findTestResult(int pageIndex, int size);
	int getTestResultTotalNumber();
	List<String> getLogList(String runID);
	String getTxtLogFile(String runID,String fileName);
	byte[] getBinaryLogFile(String runID,String fileName);
}
