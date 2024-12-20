package com.evently.evently.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.evently.evently.entities.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

  @Query("SELECT e FROM Event e LEFT JOIN FETCH e.registrations")
  List<Event> findAllWithRegistrations();

}
