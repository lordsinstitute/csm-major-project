package com.lms.backend.controller;

import com.lms.backend.common.AppConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only endpoints that expose the fixed, server-defined option lists
 * (domains + avatars) so the frontend never has to hard-code guesses about
 * what the backend will accept.
 */
@RestController
@RequestMapping("/api/meta")
public class MetaController {

    @GetMapping("/domains")
    public ResponseEntity<List<String>> getDomains() {
        return ResponseEntity.ok(AppConstants.DOMAINS);
    }

    @GetMapping("/avatars")
    public ResponseEntity<List<String>> getAvatars() {
        return ResponseEntity.ok(AppConstants.AVATAR_IDS);
    }
}
