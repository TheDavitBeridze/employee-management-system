package ge.edu.bsu.ems.position.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PositionResponse {
    public Long id;
    public String name;
    public BigDecimal baseSalary;
    public LocalDateTime createdAt;
}