import java.time.LocalDate;
import java.util.concurrent.locks.Lock;

public class OrderSystem {
    private int budgetAmount;  // 1

    public void updateBudget(int newBudgetAmount) {
        this.budgetAmount = newBudgetAmount;
    }

    public int getBudget() {
        return budgetAmount;
    }

    public boolean takeOrder1 (int quantity) {   // 1, 2
        if (orderType > 2) {
            return false;
        }
        int total = (orderType == 1 ? 1 : 2) * quantity;     // total = 1 * 2
        if (total <= budgetAmount) {
            lock.lock()
            try {
                budgetAmount -= total;
            } finally {
                lock.unlock()
            }
            return true;
        }
        return false;
    }

}