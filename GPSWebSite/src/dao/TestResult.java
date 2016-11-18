package dao;

public class TestResult {
	private String id;
	private String caseName;
	private String startTime;
	private String endTime;
	private String duration;
	private String testResult;
	private String testLog;
	
	public TestResult(String id, String caseName, String startTime, String endTime, String duration, String testResult,
			String testLog) {
		super();
		this.id = id;
		this.caseName = caseName;
		this.startTime = startTime;
		this.endTime = endTime;
		this.duration = duration;
		this.testResult = testResult;
		this.testLog = testLog;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCaseName() {
		return caseName;
	}
	public void setCaseName(String caseName) {
		this.caseName = caseName;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getTestResult() {
		return testResult;
	}
	public void setTestResult(String testResult) {
		this.testResult = testResult;
	}
	public String getTestLog() {
		return testLog;
	}
	public void setTestLog(String testLog) {
		this.testLog = testLog;
	}
}
