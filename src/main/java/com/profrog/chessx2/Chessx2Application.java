package com.profrog.chessx2;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.profrog.ImageToGif;
import io.github.profrog.PgnParse;
import io.github.profrog.PgnToImage;
import org.apache.coyote.Response;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;


import java.io.IOException;
import java.io.ObjectInputFilter;
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

		String input_link = data.get("input_link");
		input_link = path_dir + input_link.substring(1);
		ClassPathResource resource = new ClassPathResource(input_link);
		Path path = Paths.get(input_link);

		ClassPathResource resource0 = new ClassPathResource("static/images/chesschess.png");
		String output_link = Paths.get(resource0.getURI()).getParent().toString();
		List<int[][]> alpa =  PgnParse.parserInit(pgndata,0,0);
		String input_dir = PgnToImage.imageInit(alpa,path.toString());

		System.out.println(gif_name);
		int delay = Integer.parseInt(data.get("delay"));
		ImageToGif.gifInit(output_link + gif_name, input_dir, delay);
		Map<String,String> returning = new HashMap<>();

		returning.put("id",gif_name);
		returning.put("input_dir",path.toString());
		returning.put("output_dir", "./images" + gif_name);

		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(returning);
	}
}







