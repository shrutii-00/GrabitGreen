package com.grabbitgreen.grabbitgreen_backend.repository;

import com.grabbitgreen.grabbitgreen_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByCategory(String category);
}
