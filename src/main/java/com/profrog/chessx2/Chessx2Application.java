package com.profrog.chessx2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@SpringBootApplication
public class Chessx2Application {
	public static void main(String[] args) {
		SpringApplication.run(Chessx2Application.class, args);
	}
}
