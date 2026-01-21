package com.grabbitgreen.grabbitgreen_backend.controller;

import com.grabbitgreen.grabbitgreen_backend.model.Product;
import com.grabbitgreen.grabbitgreen_backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")   // dev ke liye open CORS

public class ProductController {
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET products by category
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category.toUpperCase());
    }
}
