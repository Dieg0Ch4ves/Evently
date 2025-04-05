package com.evently.evently.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        // ====================== ENDPOINTS PÚBLICOS ====================== |

                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/auth/activate").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ping").permitAll()
                        .requestMatchers(HttpMethod.GET, "/event/all").permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**", // Documentação OpenAPI (JSON)
                                "/swagger-ui/**", // Recursos do Swagger UI
                                "/swagger-ui.html" // Página principal do Swagger UI
                        ).permitAll()

                        // ====================== ENDPOINTS PRIVADOS ====================== |

                        .requestMatchers(HttpMethod.GET, "/event/get-by-user/**").hasAnyRole("USER", "ADMIN")

                        .requestMatchers(HttpMethod.GET, "/auth/**").hasAnyRole("USER", "ADMIN")

                        .requestMatchers(HttpMethod.GET, "/auth/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/auth/**").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .cors(cors -> cors
                        .configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowedOrigins(Arrays.asList(
                                    "http://localhost:5173",
                                    "https://evently-frontend-latest.onrender.com/"
                                    ));
                            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
                            config.addAllowedHeader("*");
                            config.addAllowedMethod("*");
                            return config;
                        }))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint) // Define o EntryPoint personalizado
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
