package com.lms.backend.common;

import java.util.List;

/**
 * Fixed, server-side lists that back the domain-selection and avatar-selection
 * features. Keeping these as a whitelist (rather than free text) means the
 * frontend can never send a value the backend didn't already agree to.
 *
 * IMPORTANT: if you add/remove a domain or avatar here, make the same change
 * in the frontend at src/constants/domains.js and src/constants/avatars.js
 * so the two stay in sync.
 */
public final class AppConstants {

    private AppConstants() {
    }

    public static final List<String> DOMAINS = List.of(
            "Cybersecurity",
            "AI & Machine Learning",
            "Full Stack Development",
            "Data Science",
            "Cloud Computing"
    );

    public static final List<String> AVATAR_IDS = List.of(
            "avatar1",
            "avatar2",
            "avatar3",
            "avatar4",
            "avatar5"
    );
}
