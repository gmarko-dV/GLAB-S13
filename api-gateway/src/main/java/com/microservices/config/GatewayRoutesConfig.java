package com.microservices.config;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouterFunction<ServerResponse> categoriaRouterFunction() {
        return GatewayRouterFunctions.route("categoria-route")
                .route(RequestPredicates.path("/api/categorias/**"),
                       HandlerFunctions.http("http://localhost:8081"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> productoRouterFunction() {
        return GatewayRouterFunctions.route("producto-route")
                .route(RequestPredicates.path("/api/productos/**"),
                       HandlerFunctions.http("http://localhost:8082"))
                .build();
    }
}

