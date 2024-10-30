package com.profrog.chessx2;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.profrog.ImageToGif;
import io.github.profrog.PgnParse;
import io.github.profrog.PgnToImage;
import org.apache.coyote.Response;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;

@RestController
@SpringBootApplication
public class Chessx2Application {
	public static void main(String[] args) {
		SpringApplication.run(Chessx2Application.class, args);
	}

	String path_dir = System.getProperty("user.dir") + "/src/main/resources/static/";
	@PostMapping("/api/pgntogif")
	public String makinggif(@RequestBody Map<String,String> data) throws IOException {

		Random random = new Random();
		String gif_name = "/gifoutput/" + String.valueOf(random.nextInt(1000000)) + ".gif";
		String dir0 = "\\output";
		String pgndata = data.get("pgndata");
		int black_bottom_opt = Integer.parseInt(data.get("black_bottom_opt"));
		String skin_dir = data.get("skin_dir");
		skin_dir = skin_dir.replace("./",path_dir);
		System.out.println("dddd" + skin_dir);

		String input_link = data.get("input_link");
		input_link = path_dir + input_link.substring(1);
		ClassPathResource resource = new ClassPathResource(input_link);
		Path path = Paths.get(input_link);

		ClassPathResource resource0 = new ClassPathResource("static/images/chesschess.png");
		String output_link = Paths.get(resource0.getURI()).getParent().toString();
		File directory = new File(path.toString() + "/output");

		//System.out.println("*******" + black_bottom_opt);
		List<int[][]> alpa =  PgnParse.parserInit(pgndata,black_bottom_opt,0);
		String input_dir = PgnToImage.imageInit(alpa,path.toString(),skin_dir);
		System.out.println(gif_name);
		int delay = Integer.parseInt(data.get("delay"));
		String delay0 = data.get("delay");
		//ImageToGif.gifInit(output_link + gif_name, input_dir, delay);
		try {
			// ProcessBuilder에 Python 실행 명령어와 인수 설정

			//
			String scriptPath = getClass().getClassLoader().getResource("makingGif.py").getPath();
			System.out.println("cur here " + scriptPath);
			ProcessBuilder processBuilder = new ProcessBuilder(
					"python3",
					scriptPath,         // Python 스크립트 파일 경로
					"--input_dir", input_dir,  // input_dir 인수
					"--output_dir", output_link + gif_name, // output_dir 인수
					"--delay", delay0         // delay 인수git
			);

			System.out.println("test here " +  output_link + gif_name);

			// Process 시작
			Process process = processBuilder.start();
			BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
			String errorLine;
			while ((errorLine = errorReader.readLine()) != null) {
				System.err.println(errorLine);  // Python 오류 메시지 Java 콘솔에 출력
			}
			// 프로세스 종료 코드 확인
			int exitCode = process.waitFor();
			System.out.println("Python script exited with code: " + exitCode);
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		}


        Map<String,String> returning = new HashMap<>();
		returning.put("id",gif_name);
		returning.put("input_dir",path.toString());
		returning.put("output_dir", "./images" + gif_name);

		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(returning);
	}

	@PostMapping("/api/update")
	public String updategif(@RequestBody Map<String,String> data) throws IOException {

		StringBuilder gif_links = new StringBuilder("[");
		ClassPathResource resource0 = new ClassPathResource("static/images/gifoutput/0sample.gif");
		String output_link = Paths.get(resource0.getURI()).getParent().toString();
		boolean filecheck = false;

		File directory=new File(output_link);
		if (directory.exists() && directory.isDirectory()) {

			File[] files = directory.listFiles();
			if (files != null) {
				for (File file : files) {
					// 파일 또는 폴더의 이름 출력
					gif_links.append(file.getName() + ",");
					filecheck = true;
				}
			}
		}


		if(filecheck)
		{
			gif_links.setCharAt(gif_links.length()-1, ']');
		}

		else
		{
			gif_links.append(']');
		}

		Map<String,String> returning = new HashMap<>();
		returning.put("gif_link",gif_links.toString());

		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(returning);
	}

	@PostMapping("/api/upload")
	public String uploadCustomImage(@RequestParam("file") MultipartFile file) throws IOException {
		if(file.isEmpty())
		{
			return "No file error";
		}

		try {
			// 파일을 저장할 경로 지정
			Random random = new Random();
			String filePath = path_dir + "images/custom/" + String.valueOf(random.nextInt(1000000)) + ".png";
			File dest = new File(filePath);
			// 파일 저장
			file.transferTo(dest);

			Map<String,String> returning = new HashMap<>();
			returning.put("download_dir",filePath);

			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(returning);

		} catch (IOException e) {
			e.printStackTrace();
			return "Failed to upload file: " + e.getMessage();
		}
	}

}








