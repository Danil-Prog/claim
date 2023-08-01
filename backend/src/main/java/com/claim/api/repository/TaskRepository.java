package com.claim.api.repository;

import com.claim.api.entity.Task;
import com.claim.api.entity.TaskStatus;
import com.claim.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> getTasksByCustomer(User user, PageRequest pageRequest);
    Page<Task> getTasksByDepartment_IdAndTaskStatus(Long id, PageRequest pageRequest, TaskStatus taskStatus);
    Page<Task> getTasksByDepartment_Id(Long id, PageRequest pageRequest);
}
