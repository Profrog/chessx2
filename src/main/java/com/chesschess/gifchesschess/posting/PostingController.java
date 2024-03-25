package com.chesschess.gifchesschess.posting;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PostingController {
    // TODO: rename this method to something relevant
    @GetMapping("/posting")
    private String postingMain() {
        return "posting_main";
    }
}
