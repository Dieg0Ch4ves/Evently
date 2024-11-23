package com.evently.evently.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.evently.evently.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
  UserDetails findByEmail(String email);
}
