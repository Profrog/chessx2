package com.profrog.chessx2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class frontend {

    @GetMapping(value = "/")
    public String mainpage() {
        //return "main";
        return "google854d6ce6f5670d09";
    }

    @GetMapping(value = "/ptg")
    public String ptgpage() {
        return "pgntogif";
    }

    @GetMapping(value = "/about")
    public String aboutpage() {
        return "about";
    }
}
