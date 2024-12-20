package com.evently.evently.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evently.evently.entities.Event;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

  EventRegistration findByUserAndEvent(User user, Event event);

}
