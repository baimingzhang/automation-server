package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.google.gson.Gson;

import dao.TestResult;
import dao.TestResultSQLServerDAO;

/**
 * Servlet implementation class MyServlet
 */
@WebServlet("/MyServlet")
public class MyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MyServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		String p = request.getParameter("page");
		String s = request.getParameter("size");
		int page = Integer.parseInt(p);
		int size = Integer.parseInt(s);
		System.out.println("Page number is "+page+"    size is "+size);
		TestResultSQLServerDAO testResultSQLServerDAO = new TestResultSQLServerDAO();
		List<TestResult> testResults = testResultSQLServerDAO.findTestResult(page, size);
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("testResult", testResults);
		int resultCount = testResultSQLServerDAO.getTestResultTotalNumber();
		resultMap.put("resultCount", resultCount);
		Gson gson = new Gson();
		String result = gson.toJson(resultMap);
		out.write(result);
		out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
