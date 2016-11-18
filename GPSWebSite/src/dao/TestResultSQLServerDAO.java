package dao;

import java.io.BufferedReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;

import com.google.gson.Gson;

public class TestResultSQLServerDAO implements TestResultDAO {

	final static String DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	final static String CONNECTION = "jdbc:sqlserver://PHMNL1-SQLXian;DatabaseName=AutomatedTesting;integratedSecurity=true";
	private int resultCount = 0;
	private Statement stQueryStatement = null;
	private ResultSet rsResultSet = null;
	private Connection conConnection = null;

	@Override
	public List<TestResult> findTestResult(int pageIndex, int size) {
		resultCount = 1;
		String sQuery = "select * from test_run order by runid desc";
		List<TestResult> result = new ArrayList<>();
		try {
			connectToDB();
			stQueryStatement = conConnection.createStatement();
			rsResultSet = stQueryStatement.executeQuery(sQuery);

			ResultSetMetaData rsmd = rsResultSet.getMetaData();
			int total = rsmd.getColumnCount();
			String[] titles = new String[7];
			for (int i = 1; i <= total; i++) {
				titles[i - 1] = rsmd.getColumnName(i);
			}
			while (rsResultSet.next()) {
				if (resultCount > size * (pageIndex - 1) && resultCount < size * pageIndex + 1) {
					TestResult testResult = new TestResult(String.valueOf(rsResultSet.getInt(1)),
							rsResultSet.getString(2), rsResultSet.getString(3), rsResultSet.getString(4),
							rsResultSet.getString(5), rsResultSet.getString(6), rsResultSet.getString(7));
					result.add(testResult);
				}
				resultCount++;
			}
			return result;
		} catch (Exception e2) {
			e2.printStackTrace();
		} finally {
			disconnetctToDB();
		}
		return result;
	}

	@Override
	public int getTestResultTotalNumber() {
		String sQuery = "select count(*) from test_run";
		try {
			connectToDB();
			stQueryStatement = conConnection.createStatement();
			rsResultSet = stQueryStatement.executeQuery(sQuery);
			while (rsResultSet.next()) {
				return rsResultSet.getInt(1);
			}
		} catch (Exception e2) {
			e2.printStackTrace();
		} finally {
			disconnetctToDB();
		}
		return 0;
	}

	private boolean connectToDB() {
		try {
			Class.forName(DRIVER);
			conConnection = DriverManager.getConnection(CONNECTION);
			if (conConnection == null) {
				System.out.println("Connet DB failed!!");
				return false;
			} else
				System.out.println("Connet DB successfully!!");
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private boolean disconnetctToDB() {
		try {
			if (rsResultSet != null)
				rsResultSet.close();
			if (conConnection != null)
				conConnection.close();
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public List<String> getLogList(String runID) {
		String sQuery = "select FileName from log_file where RunID =" + runID;
		List<String> logList = new ArrayList<>();
		try {
			connectToDB();
			stQueryStatement = conConnection.createStatement();
			rsResultSet = stQueryStatement.executeQuery(sQuery);
			while (rsResultSet.next()) {
				logList.add(rsResultSet.getString(1));
			}
		} catch (Exception e2) {
			e2.printStackTrace();
		} finally {
			disconnetctToDB();
		}
		return logList;
	}

	@Override
	public String getTxtLogFile(String runID, String fileName) {
		String sQuery = "select File_VARCHAR_Content from log_file where RunID =" + runID + " and FileName='" + fileName
				+ "'";
		System.out.println(sQuery);
		String result="";
		try {
			connectToDB();
			PreparedStatement ps = conConnection.prepareStatement(sQuery);
			ResultSet rs = ps.executeQuery();
			rs.next();
			StringBuilder sb = new StringBuilder();

			Reader r = rs.getCharacterStream(1);
			BufferedReader br = new BufferedReader(r);
			String line;
			while (null != (line = br.readLine())) {
				sb.append(line).append("\n");
			}
			br.close();
			result = sb.toString();
			return result;
		} catch (Exception e2) {
			e2.printStackTrace();
		} finally {
			disconnetctToDB();
		}
		return result;
	}

	@Override
	public byte[] getBinaryLogFile(String runID, String fileName) {
		String sQuery = "select File_BINARY_Content from log_file where RunID =" + runID + " and FileName='" + fileName
				+ "'";
		System.out.println(sQuery);
		byte[] result = null;
		try {
			connectToDB();
			PreparedStatement ps = conConnection.prepareStatement(sQuery);
			ResultSet rs = ps.executeQuery();
			rs.next();
			result = rs.getBytes(1);
			return result;
		} catch (Exception e2) {
			e2.printStackTrace();
		} finally {
			disconnetctToDB();
		}
		return result;
	}
}
