import { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import {
  getTaskById,
  getTaskCategories,
  updateTaskCategory,
  updateTaskStatus,
} from "../../api/taskApi";
import "./TaskInspectPage.css";
import { API_BASE_URL } from "../../api/httpClient";

const STATUS_OPTIONS = ["new", "in-progress", "delayed", "completed"];

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString();
}

function TaskInspectPage({ user, taskId, onNavigate, onLogout }) {
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("Loading task details...");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState("");
  const [isTaskStatusMenuOpen, setIsTaskStatusMenuOpen] = useState(false);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState("new");
  const [isSavingTaskStatus, setIsSavingTaskStatus] = useState(false);
  const [taskStatusMessage, setTaskStatusMessage] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(0);

  const handleEmail = (event) => {
    event.preventDefault();
    let reply = new XMLHttpRequest();
    const form = event.target;
    const formData = new FormData(form);
    reply.open("POST", `${API_BASE_URL}/task/${taskId}/reply`);
    reply.setRequestHeader("Content-type", "application/json");
    reply.send(
      JSON.stringify({
        content: formData.get("emailContent"),
      }),
    );
    window.location.reload();
  };

  const handleTaskDueDateSave = () => {
    let dueDate = taskDueDate;
    let reply = new XMLHttpRequest();
    reply.open(
      "PATCH",
      `${API_BASE_URL}/task/${taskId}/due-date?due_date=${dueDate}`,
    );
    reply.setRequestHeader("Content-type", "application/json");
    reply.send();
  };

  useEffect(() => {
    async function loadTask() {
      if (!taskId) {
        setTask(null);
        setStatus("No task selected.");
        return;
      }

      setStatus("Loading task details...");
      try {
        const response = await getTaskById(taskId);
        const nextTask = response?.task || null;
        setTask(nextTask);
        setStatus(nextTask ? "" : "Task not found.");
        setSelectedCategory(nextTask?.categories || "");
        setSelectedTaskStatus(nextTask?.status || "new");
        setTaskDueDate(nextTask?.due_date);
      } catch (error) {
        setTask(null);
        setStatus(error.message || "Unable to load task details.");
      }
    }

    loadTask();
  }, [taskId]);

  useEffect(() => {
    async function loadCategoryOptions() {
      try {
        const response = await getTaskCategories();
        const normalized = (response?.categories || [])
          .map((row) => row?.cname)
          .filter(Boolean);
        setCategoryOptions(normalized);
      } catch {
        setCategoryOptions([]);
      }
    }

    loadCategoryOptions();
  }, []);

  const taskTitle = useMemo(() => {
    if (!task) {
      return "Task Details";
    }

    return task.name || `Task #${task.tno || taskId}`;
  }, [task, taskId]);

  async function handleCategorySave(event) {
    event.preventDefault();
    if (!task?.tno || !selectedCategory) {
      return;
    }

    setIsSavingCategory(true);
    setCategoryStatus("");
    try {
      const response = await updateTaskCategory(task.tno, selectedCategory);
      const nextCategory = response?.category || selectedCategory;
      setTask((prev) => (prev ? { ...prev, categories: nextCategory } : prev));
      setSelectedCategory(nextCategory);
      setCategoryStatus("Category updated.");
      setIsCategoryMenuOpen(false);
    } catch (error) {
      setCategoryStatus(error.message || "Unable to update category.");
    } finally {
      setIsSavingCategory(false);
    }
  }

  function handleCategoryCancel() {
    setSelectedCategory(task?.categories || "");
    setCategoryStatus("");
    setIsCategoryMenuOpen(false);
  }

  async function handleTaskStatusSave(event) {
    event.preventDefault();
    if (!task?.tno || !selectedTaskStatus) {
      return;
    }

    setIsSavingTaskStatus(true);
    setTaskStatusMessage("");
    try {
      const response = await updateTaskStatus(task.tno, selectedTaskStatus);
      const nextStatus = response?.new_status || selectedTaskStatus;
      setTask((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      setSelectedTaskStatus(nextStatus);
      setTaskStatusMessage("Status updated.");
      setIsTaskStatusMenuOpen(false);
    } catch (error) {
      setTaskStatusMessage(error.message || "Unable to update status.");
    } finally {
      setIsSavingTaskStatus(false);
    }
  }

  function handleTaskStatusCancel() {
    setSelectedTaskStatus(task?.status || "new");
    setTaskStatusMessage("");
    setIsTaskStatusMenuOpen(false);
  }

  return (
    <div className="task-inspect-page">
      <Header
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activeView="main"
      />
      <main className="task-inspect-main">
        <section className="task-inspect-hero">
          <p className="task-inspect-eyebrow">Inspector</p>
          <h1 className="task-inspect-title">{taskTitle}</h1>
          <p className="task-inspect-subtitle">
            Review complete task information and due date details.
          </p>
        </section>

        <section className="task-inspect-card">
          <div className="task-inspect-actions">
            <button
              type="button"
              className="task-inspect-back-btn"
              onClick={() => onNavigate("main")}
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              <span>Back to Task List</span>
            </button>
          </div>

          {status && <p className="task-inspect-message">{status}</p>}

          {!status && task && (
            <div className="task-inspect-grid">
              <div className="task-inspect-item">
                <span className="task-inspect-label">Task ID</span>
                <span className="task-inspect-value">{task.tno || "-"}</span>
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Status</span>
                <div className="task-inspect-category-row">
                  <span className="task-inspect-value">
                    {task.status || "new"}
                  </span>
                  <div className="task-inspect-category-actions">
                    <button
                      type="button"
                      className="task-inspect-category-btn"
                      onClick={() => {
                        setTaskStatusMessage("");
                        setIsTaskStatusMenuOpen((open) => !open);
                      }}
                    >
                      Change
                    </button>
                    {isTaskStatusMenuOpen && (
                      <form
                        className="task-inspect-category-menu"
                        onSubmit={handleTaskStatusSave}
                      >
                        <select
                          className="task-inspect-category-select"
                          value={selectedTaskStatus}
                          onChange={(event) =>
                            setSelectedTaskStatus(event.target.value)
                          }
                          disabled={isSavingTaskStatus}
                        >
                          <option value="">Select status</option>
                          {STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <div className="task-inspect-category-menu-actions">
                          <button
                            type="submit"
                            className="task-inspect-category-btn"
                            disabled={!selectedTaskStatus || isSavingTaskStatus}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="task-inspect-category-btn"
                            onClick={handleTaskStatusCancel}
                            disabled={isSavingTaskStatus}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                {taskStatusMessage && (
                  <span className="task-inspect-inline-message">
                    {taskStatusMessage}
                  </span>
                )}
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Category</span>
                <div className="task-inspect-category-row">
                  <span className="task-inspect-value">
                    {task.categories || "Uncategorized"}
                  </span>
                  <div className="task-inspect-category-actions">
                    <button
                      type="button"
                      className="task-inspect-category-btn"
                      onClick={() => {
                        setCategoryStatus("");
                        setIsCategoryMenuOpen((open) => !open);
                      }}
                    >
                      Change
                    </button>
                    {isCategoryMenuOpen && (
                      <form
                        className="task-inspect-category-menu"
                        onSubmit={handleCategorySave}
                      >
                        <select
                          className="task-inspect-category-select"
                          value={selectedCategory}
                          onChange={(event) =>
                            setSelectedCategory(event.target.value)
                          }
                          disabled={isSavingCategory}
                        >
                          <option value="">Select category</option>
                          {categoryOptions.map((categoryName) => (
                            <option key={categoryName} value={categoryName}>
                              {categoryName}
                            </option>
                          ))}
                        </select>
                        <div className="task-inspect-category-menu-actions">
                          <button
                            type="submit"
                            className="task-inspect-category-btn"
                            disabled={!selectedCategory || isSavingCategory}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="task-inspect-category-btn"
                            onClick={handleCategoryCancel}
                            disabled={isSavingCategory}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                {categoryStatus && (
                  <span className="task-inspect-inline-message">
                    {categoryStatus}
                  </span>
                )}
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Due Date</span>
                <span
                  className="task-inspect-value"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    value={taskDueDate}
                    onChange={(event) => setTaskDueDate(event.target.value)}
                  />
                  <button
                    type="button"
                    className="task-inspect-category-btn"
                    onClick={() => {
                      handleTaskDueDateSave();
                    }}
                  >
                    Save Due Date
                  </button>
                </span>
              </div>
              <div className="task-inspect-item task-inspect-item-wide">
                <span className="task-inspect-label">Summary</span>
                <span className="task-inspect-value">
                  {task.summary || "No summary available."}
                </span>
              </div>
              <div className="task-inspect-item task-inspect-item-wide">
                <span className="task-inspect-label">Description</span>
                <span className="task-inspect-value">
                  {task.description || "No description available."}
                </span>
              </div>
              <form
                className="task-inspect-item task-inspect-item-wide"
                onSubmit={handleEmail}
              >
                <span className="task-inspect-label">Reply to Customer</span>
                {task.email && (
                  <p className="task-email-recipient">
                    <span>To:</span> {task.email}
                  </p>
                )}
                <textarea
                  name="emailContent"
                  className="task-email-area"
                  placeholder="Dear Mr/Ms/Mrs/Mx..."
                  required
                ></textarea>
                <button type="submit" className="EmailSend">
                  Send
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TaskInspectPage;
