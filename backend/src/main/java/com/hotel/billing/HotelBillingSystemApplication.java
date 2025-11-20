package com.hotel.billing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HotelBillingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelBillingSystemApplication.class, args);
    }
}
