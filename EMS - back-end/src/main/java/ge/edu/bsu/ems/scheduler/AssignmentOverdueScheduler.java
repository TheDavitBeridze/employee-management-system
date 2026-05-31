package ge.edu.bsu.ems.scheduler;

import ge.edu.bsu.ems.assignment.AssignmentOverdueSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentOverdueScheduler {

    private final AssignmentOverdueSyncService assignmentOverdueSyncService;


    @Scheduled(cron = "0 5 0 * * *")
    public void runAssignmentOverdueSync() {
        log.info("Scheduler triggered: AssignmentOverdueScheduler");
        assignmentOverdueSyncService.syncOverdueAssignments();
    }
}