package servlet;

import java.io.IOException;
import java.io.OutputStream;
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

import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONObject;

import com.google.gson.Gson;

import dao.TestResult;
import dao.TestResultSQLServerDAO;

/**
 * Servlet implementation class MyServlet
 */
@WebServlet("/LogServlet")
public class LogServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LogServlet() {
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
		
		
		String action = request.getParameter("action");
		String runID = request.getParameter("runid");
		System.out.println("Action is " + action + "    RunID is " + runID);
		TestResultSQLServerDAO testResultSQLServerDAO = new TestResultSQLServerDAO();
		String result = "";
		Gson gson = new Gson();
		if (action.equals("getLogList")) {
			PrintWriter out = response.getWriter();
			result = gson.toJson(testResultSQLServerDAO.getLogList(runID));
			out.write(result);
			out.close();
		} else if (action.equals("getLogFile")) {
			String filename = request.getParameter("filename");
			System.out.println("filename is " + filename);
			String ext = FilenameUtils.getExtension(filename);
			if (ext.equals("txt")) {
				PrintWriter out = response.getWriter();
				result = testResultSQLServerDAO.getTxtLogFile(runID, filename);
				out.write(result);
				out.close();
			} else if (ext.equals("png") || ext.equals("xlsx") || ext.equals("xls")) {
				OutputStream outputstream = response.getOutputStream();
				byte[] bytes = testResultSQLServerDAO.getBinaryLogFile(runID, filename);
				outputstream.write(bytes,0,bytes.length);
				
				outputstream.close();
			}
		}
		
		
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
