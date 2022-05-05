package io.openvidu.server.contents;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;

import java.lang.reflect.Method;

public class AsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
    @Override
    public void handleUncaughtException(Throwable throwable, Method method, Object... objects) {
        System.out.println("Thread Error Exception");
        System.out.println("exception Message :: " + throwable.getMessage());
        System.out.println("method name :: " + method.getName());
        for(Object param : objects) {
            System.out.println("param Val ::: " + param);
        }
    }
}
