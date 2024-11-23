package com.profrog.chessx2;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.profrog.ImageToGif;
import io.github.profrog.PgnParse;
import io.github.profrog.PgnToImage;
import org.apache.coyote.Response;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;
import java.util.logging.Logger;

@RestController
@SpringBootApplication
public class Chessx2Application {

	public static void main(String[] args) {
		//server 시작
		SpringApplication.run(Chessx2Application.class, args);
	}

	String path_dir = System.getProperty("user.dir") + "/src/main/resources/static/";
	//기본 관리 path : chessx2가 저장된 프로젝트 경로

	@PostMapping("/api/pgntogif")
	public String makinggif(@RequestBody Map<String,String> data) throws IOException {
		//스킨 데이터와 pgn데이터를 이용하여 gif를 만들기 위한 소스를 제공하고 gif를 만들고 해당 파일의 경로 반환

		path_dir = path_dir.replace("build\\","");//build/libs는 jar파일이 위치한 곳으로, 프로젝트 루트 경로를 겨냥하도록 수정한다.
		path_dir =  path_dir.replace("libs/","");

		Random random = new Random();
		String gif_name = "/gifoutput/" + String.valueOf(random.nextInt(1000000)) + ".gif";
		//gifoutput 폴더에 랜덤한 이름을 가진 gif용 반환 이름을 만들어 준다.

		String pgndata = data.get("pgndata");
		int black_bottom_opt = Integer.parseInt(data.get("black_bottom_opt"));
		String skin_dir = data.get("skin_dir");
		skin_dir = skin_dir.replace("./",path_dir);
		System.out.println("스킨 데이터 얻는 중");
		//호출자로 부터 skin dir를 획득하고 변수로 저장한다.

		String input_link = data.get("input_link");
		input_link = path_dir + input_link.substring(1);
		Path path = Paths.get(input_link);
		//현재 입력값들이 저장된 경로를 저장

		List<int[][]> alpa =  PgnParse.parserInit(pgndata,black_bottom_opt,0);
		String input_dir = PgnToImage.imageInit(alpa,path.toString(),skin_dir);
		String delay0 = data.get("delay");
		String out_link = path_dir + "images" + gif_name;
		System.out.println("pgnparse로 스킨 데이터 얻는 중");
		//pgnparse로 pgn데이터와 스킨이 반영된 이미지 소스 파일 더미 만들기

		try {
			String scriptPath = path_dir + "makingGif.py";
			ProcessBuilder processBuilder = new ProcessBuilder(
					"python3",
					scriptPath,         // Python 스크립트 파일 경로
					"--input_dir", input_dir,  // input_dir 인수
					"--output_dir", out_link, // output_dir 인수
					"--delay", delay0         // delay 인수
			);
			// Process 시작
			Process process = processBuilder.start();
			BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
			String errorLine;
			while ((errorLine = errorReader.readLine()) != null) {
				System.err.println(errorLine);  // Python 오류 메시지 Java 콘솔에 출력
			}
			int exitCode = process.waitFor();
			System.out.println("gif 생성 종료, 코드 확인 필요" + exitCode);

		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		}

        Map<String,String> returning = new HashMap<>();
		returning.put("id",gif_name);
		returning.put("input_dir",path.toString());
		returning.put("output_dir", out_link);
		//반환용 데이터 수집

		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(returning);
	}

	@PostMapping("/api/upload")
	public String uploadCustomImage(@RequestParam("file") MultipartFile file) throws IOException {
		//유저가 선택한 이미지 파일을 스킨 이미지로 대체하고 화면에 보여주기 위한 링크 제공
		if(file.isEmpty())
		{
			return "No file error";
		}

		try {
			// 파일을 저장할 경로 지정
			Random random = new Random();
			path_dir = path_dir.replace("build\\","");//루트 경로를 바라보도록 수정
			path_dir =  path_dir.replace("libs/","");
			String filePath = path_dir + "images/custom/" + String.valueOf(random.nextInt(1000000)) + ".png";
			System.out.println("유저 커스텀 파일 생성 시작");

			File dest = new File(filePath);
			file.transferTo(dest);
			System.out.println("파일 변환 완료");

			Map<String,String> returning = new HashMap<>();
			returning.put("download_dir",filePath);
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(returning);

		} catch (IOException e) {
			e.printStackTrace();
			return "Failed to upload file: " + e.getMessage();
		}
	}

	@GetMapping("/api/getgif")
	public ResponseEntity<Resource> serveFile(@RequestParam String filePath) {
		//gif 경로를 서버로 올리기 위한 로직
		Resource resource = new FileSystemResource(filePath);

		if (resource.exists()) {
			return ResponseEntity.ok()
					.contentType(org.springframework.http.MediaType.IMAGE_GIF)
					.body(resource);
		} else {
			return ResponseEntity.notFound().build();
		}
	}


	@PostMapping("/api/update")
	public String updategif(@RequestBody Map<String,String> data) throws IOException {
		// 유저 gif데이터 리스팅 하기 위한 로직, 현재 사용 중이지 않음
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
}








