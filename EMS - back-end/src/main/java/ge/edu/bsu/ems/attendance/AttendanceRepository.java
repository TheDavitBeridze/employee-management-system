package ge.edu.bsu.ems.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);

    Optional<Attendance> findFirstByEmployeeIdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(Long employeeId);

    boolean existsByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);

    List<Attendance> findByEmployeeIdOrderByWorkDateDescCheckInTimeDesc(Long employeeId);

    List<Attendance> findByEmployeeIdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(Long employeeId);

    List<Attendance> findByEmployeeIdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
            Long employeeId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployeeIdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
            Long employeeId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployee_Department_IdOrderByWorkDateDescCheckInTimeDesc(Long departmentId);

    List<Attendance> findByEmployee_Department_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(Long departmentId);

    List<Attendance> findByEmployee_Department_IdAndEmployee_IdOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            Long employeeId
    );

    List<Attendance> findByEmployee_Department_IdAndEmployee_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            Long employeeId
    );

    List<Attendance> findByEmployee_Department_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployee_Department_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            Long employeeId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
            Long departmentId,
            Long employeeId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findAllByOrderByWorkDateDescCheckInTimeDesc();

    List<Attendance> findByCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc();

    List<Attendance> findByWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByEmployee_Department_IdAndEmployee_Id(
            Long departmentId,
            Long employeeId
    );
}