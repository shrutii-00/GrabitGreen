package com.grabbitgreen.grabbitgreen_backend.config;

import com.grabbitgreen.grabbitgreen_backend.model.Product;
import com.grabbitgreen.grabbitgreen_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration

public class DataSeeder {

    @Bean
    public CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                Product p1 = new Product(
                        null,
                        "Fresh Tomatoes",
                        "Ripe red tomatoes, perfect for salads and curries.",
                        45.0,
                        "1 kg",
                        "VEGETABLES",
                        null,
                        true
                );

                Product p2 = new Product(
                        null,
                        "Bananas",
                        "Sweet bananas for smoothies and snacks.",
                        60.0,
                        "1 dozen",
                        "FRUITS",
                        null,
                        true
                );

                Product p3 = new Product(
                        null,
                        "Full Cream Milk",
                        "Toned fresh milk, ideal for tea and coffee.",
                        65.0,
                        "1 L",
                        "DAIRY",
                        null,
                        true
                );

                productRepository.save(p1);
                productRepository.save(p2);
                productRepository.save(p3);
            }
        };
    }
}
