package com.hotel.billing.config;

import com.hotel.billing.models.*;
import com.hotel.billing.repositories.CategoryRepository;
import com.hotel.billing.repositories.MenuItemRepository;
import com.hotel.billing.repositories.RestaurantTableRepository;
import com.hotel.billing.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize default users
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Administrator")
                    .email("admin@hotel.com")
                    .phone("9876543210")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            User servant = User.builder()
                    .username("servant")
                    .password(passwordEncoder.encode("servant123"))
                    .fullName("Waiter One")
                    .email("servant@hotel.com")
                    .phone("9876543211")
                    .role(Role.SERVANT)
                    .active(true)
                    .build();

            User kitchen = User.builder()
                    .username("kitchen")
                    .password(passwordEncoder.encode("kitchen123"))
                    .fullName("Chef Kumar")
                    .email("kitchen@hotel.com")
                    .phone("9876543212")
                    .role(Role.KITCHEN)
                    .active(true)
                    .build();

            User cashier = User.builder()
                    .username("cashier")
                    .password(passwordEncoder.encode("cashier123"))
                    .fullName("Cashier Singh")
                    .email("cashier@hotel.com")
                    .phone("9876543213")
                    .role(Role.CASHIER)
                    .active(true)
                    .build();

            userRepository.save(admin);
            userRepository.save(servant);
            userRepository.save(kitchen);
            userRepository.save(cashier);

            log.info("Default users created successfully!");
            log.info("Admin: username=admin, password=admin123");
            log.info("Servant: username=servant, password=servant123");
            log.info("Kitchen: username=kitchen, password=kitchen123");
            log.info("Cashier: username=cashier, password=cashier123");
        }

        // Initialize categories
        if (categoryRepository.count() == 0) {
            log.info("Initializing categories...");

            Category starters = Category.builder()
                    .name("Starters")
                    .description("Appetizers and starters")
                    .active(true)
                    .build();

            Category mainCourse = Category.builder()
                    .name("Main Course")
                    .description("Main dishes")
                    .active(true)
                    .build();

            Category beverages = Category.builder()
                    .name("Beverages")
                    .description("Drinks and beverages")
                    .active(true)
                    .build();

            Category desserts = Category.builder()
                    .name("Desserts")
                    .description("Sweet dishes")
                    .active(true)
                    .build();

            categoryRepository.save(starters);
            categoryRepository.save(mainCourse);
            categoryRepository.save(beverages);
            categoryRepository.save(desserts);

            log.info("Categories created successfully!");
        }

        // Initialize sample menu items
        if (menuItemRepository.count() == 0) {
            log.info("Initializing sample menu items...");

            Category starters = categoryRepository.findByName("Starters").orElseThrow();
            Category mainCourse = categoryRepository.findByName("Main Course").orElseThrow();
            Category beverages = categoryRepository.findByName("Beverages").orElseThrow();
            Category desserts = categoryRepository.findByName("Desserts").orElseThrow();

            // Starters
            menuItemRepository.save(MenuItem.builder()
                    .category(starters)
                    .name("Paneer Tikka")
                    .description("Grilled cottage cheese with spices")
                    .price(new BigDecimal("180.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .category(starters)
                    .name("Chicken Wings")
                    .description("Spicy fried chicken wings")
                    .price(new BigDecimal("220.00"))
                    .isVeg(false)
                    .available(true)
                    .build());

            // Main Course
            menuItemRepository.save(MenuItem.builder()
                    .category(mainCourse)
                    .name("Butter Chicken")
                    .description("Creamy tomato-based chicken curry")
                    .price(new BigDecimal("320.00"))
                    .isVeg(false)
                    .available(true)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .category(mainCourse)
                    .name("Dal Makhani")
                    .description("Creamy black lentils")
                    .price(new BigDecimal("240.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .category(mainCourse)
                    .name("Biryani")
                    .description("Aromatic rice with spices")
                    .price(new BigDecimal("280.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            // Beverages
            menuItemRepository.save(MenuItem.builder()
                    .category(beverages)
                    .name("Mango Lassi")
                    .description("Sweet mango yogurt drink")
                    .price(new BigDecimal("80.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .category(beverages)
                    .name("Masala Chai")
                    .description("Spiced Indian tea")
                    .price(new BigDecimal("40.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            // Desserts
            menuItemRepository.save(MenuItem.builder()
                    .category(desserts)
                    .name("Gulab Jamun")
                    .description("Sweet fried dumplings in syrup")
                    .price(new BigDecimal("90.00"))
                    .isVeg(true)
                    .available(true)
                    .build());

            log.info("Sample menu items created successfully!");
        }

        // Initialize restaurant tables
        if (tableRepository.count() == 0) {
            log.info("Initializing restaurant tables...");

            for (int i = 1; i <= 10; i++) {
                RestaurantTable table = RestaurantTable.builder()
                        .tableNumber("T" + i)
                        .capacity(i % 3 == 0 ? 6 : (i % 2 == 0 ? 4 : 2))
                        .status(TableStatus.FREE)
                        .build();
                tableRepository.save(table);
            }

            log.info("Restaurant tables created successfully!");
        }

        log.info("=== Database initialization complete ===");
    }
}
