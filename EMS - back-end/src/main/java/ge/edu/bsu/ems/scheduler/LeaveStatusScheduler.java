package ge.edu.bsu.ems.scheduler;

import ge.edu.bsu.ems.leave_request.LeaveStatusSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LeaveStatusScheduler {

    private final LeaveStatusSyncService leaveStatusSyncService;


    @Scheduled(cron = "0 5 0 * * *")
    public void runLeaveStatusSync() {
        log.info("Scheduler triggered: LeaveStatusScheduler");
        leaveStatusSyncService.syncEmployeeStatusesWithApprovedLeaves();
    }
}