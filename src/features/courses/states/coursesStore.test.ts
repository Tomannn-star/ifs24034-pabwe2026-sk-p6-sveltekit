import { describe, it, expect, vi, beforeEach } from "vitest";
import { coursesStore, createCoursesStore } from "./coursesStore";
import courseApi from "../api/courseApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("coursesStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    coursesStore.reset();
  });

  it("should initialize with default state and reset correctly", () => {
    const store = createCoursesStore();
    expect(store.courses).toEqual([]);
    expect(store.course).toBeNull();
    expect(store.content).toBeNull();
    expect(store.isCourse).toBe(false);
    expect(store.isCourseAdd).toBe(false);

    store.setCourses([{ id: 1, title: "Test", description: "Desc", user_id: 1 }]);
    expect(store.courses.length).toBe(1);

    store.reset();
    expect(store.courses.length).toBe(0);
  });

  it("should test all setters and getters", () => {
    const c = { id: 1, title: "Course", description: "D", user_id: 1 };
    const content = { id: 10, title: "Cont", youtube: "yt" };

    coursesStore.setCourse(c);
    expect(coursesStore.course).toEqual(c);

    coursesStore.setContent(content);
    expect(coursesStore.content).toEqual(content);

    coursesStore.setIsCourse(true);
    expect(coursesStore.isCourse).toBe(true);

    coursesStore.setIsCourseAdd(true);
    expect(coursesStore.isCourseAdd).toBe(true);

    coursesStore.setIsCourseAdded(true);
    expect(coursesStore.isCourseAdded).toBe(true);

    coursesStore.setIsCourseChange(true);
    expect(coursesStore.isCourseChange).toBe(true);

    coursesStore.setIsCourseChanged(true);
    expect(coursesStore.isCourseChanged).toBe(true);

    coursesStore.setIsCourseChangeCover(true);
    expect(coursesStore.isCourseChangeCover).toBe(true);

    coursesStore.setIsCourseChangedCover(true);
    expect(coursesStore.isCourseChangedCover).toBe(true);

    coursesStore.setIsCourseDelete(true);
    expect(coursesStore.isCourseDelete).toBe(true);

    coursesStore.setIsCourseDeleted(true);
    expect(coursesStore.isCourseDeleted).toBe(true);

    coursesStore.setIsCourseDeleteAll(true);
    expect(coursesStore.isCourseDeleteAll).toBe(true);

    coursesStore.setIsCourseDeletedAll(true);
    expect(coursesStore.isCourseDeletedAll).toBe(true);

    coursesStore.setIsStudentEnroll(true);
    expect(coursesStore.isStudentEnroll).toBe(true);

    coursesStore.setIsStudentEnrolled(true);
    expect(coursesStore.isStudentEnrolled).toBe(true);

    coursesStore.setIsStudentLeave(true);
    expect(coursesStore.isStudentLeave).toBe(true);

    coursesStore.setIsStudentLeft(true);
    expect(coursesStore.isStudentLeft).toBe(true);

    coursesStore.setIsRatingSubmit(true);
    expect(coursesStore.isRatingSubmit).toBe(true);

    coursesStore.setIsRatingSubmitted(true);
    expect(coursesStore.isRatingSubmitted).toBe(true);

    coursesStore.setIsContent(true);
    expect(coursesStore.isContent).toBe(true);

    coursesStore.setIsContentAdd(true);
    expect(coursesStore.isContentAdd).toBe(true);

    coursesStore.setIsContentAdded(true);
    expect(coursesStore.isContentAdded).toBe(true);

    coursesStore.setIsContentChange(true);
    expect(coursesStore.isContentChange).toBe(true);

    coursesStore.setIsContentChanged(true);
    expect(coursesStore.isContentChanged).toBe(true);

    coursesStore.setIsContentDelete(true);
    expect(coursesStore.isContentDelete).toBe(true);

    coursesStore.setIsContentDeleted(true);
    expect(coursesStore.isContentDeleted).toBe(true);

    coursesStore.setIsLearnStatusChange(true);
    expect(coursesStore.isLearnStatusChange).toBe(true);

    coursesStore.setIsLearnStatusChanged(true);
    expect(coursesStore.isLearnStatusChanged).toBe(true);
  });

  // asyncSetCourses
  it("should fetch courses successfully", async () => {
    const list = [{ id: 1, title: "C1", description: "D", user_id: 1 }];
    vi.spyOn(courseApi, "getCourses").mockResolvedValue(list);

    await coursesStore.asyncSetCourses("1", "react");
    expect(coursesStore.courses).toEqual(list);
  });

  it("should fallback to empty array when fetch courses fails", async () => {
    vi.spyOn(courseApi, "getCourses").mockRejectedValue(new Error("Fail"));

    await coursesStore.asyncSetCourses();
    expect(coursesStore.courses).toEqual([]);
  });

  // asyncSetCourse
  it("should fetch course by id successfully", async () => {
    const c = { id: 1, title: "C1", description: "D", user_id: 1 };
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue(c);

    await coursesStore.asyncSetCourse(1);
    expect(coursesStore.course).toEqual(c);
    expect(coursesStore.isCourse).toBe(true);
  });

  it("should set course null on failure", async () => {
    vi.spyOn(courseApi, "getCourseById").mockRejectedValue(new Error("Fail"));

    await coursesStore.asyncSetCourse(99);
    expect(coursesStore.course).toBeNull();
    expect(coursesStore.isCourse).toBe(true);
  });

  // asyncSetIsCourseAdd
  it("should handle add course success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "postCourse").mockResolvedValue("Success");
    await coursesStore.asyncSetIsCourseAdd("T", "D");
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isCourseAdded).toBe(true);
    expect(coursesStore.isCourseAdd).toBe(true);

    vi.spyOn(courseApi, "postCourse").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsCourseAdd("T", "D");
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isCourseAdded).toBe(false);
  });

  // asyncSetIsCourseChange
  it("should handle change course success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "putCourse").mockResolvedValue("Success");
    await coursesStore.asyncSetIsCourseChange(1, "T", "D");
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isCourseChanged).toBe(true);

    vi.spyOn(courseApi, "putCourse").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsCourseChange(1, "T", "D");
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isCourseChanged).toBe(false);
  });

  // asyncSetIsCourseChangeCover
  it("should handle change course cover success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const file = new File(["dummy"], "c.jpg");

    vi.spyOn(courseApi, "postCourseCover").mockResolvedValue("Success");
    await coursesStore.asyncSetIsCourseChangeCover(1, file);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isCourseChangedCover).toBe(true);

    vi.spyOn(courseApi, "postCourseCover").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsCourseChangeCover(1, file);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isCourseChangedCover).toBe(false);
  });

  // asyncSetIsCourseDelete
  it("should handle delete course success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "deleteCourse").mockResolvedValue("Success");
    await coursesStore.asyncSetIsCourseDelete(1);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isCourseDeleted).toBe(true);

    vi.spyOn(courseApi, "deleteCourse").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsCourseDelete(1);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isCourseDeleted).toBe(false);
  });

  // asyncSetIsCourseDeleteAll
  it("should handle delete all courses success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "deleteAllCourses").mockResolvedValue("Success");
    await coursesStore.asyncSetIsCourseDeleteAll();
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isCourseDeletedAll).toBe(true);

    vi.spyOn(courseApi, "deleteAllCourses").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsCourseDeleteAll();
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isCourseDeletedAll).toBe(false);
  });

  // Students
  it("should handle enroll student success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "postEnrollStudent").mockResolvedValue("Success");
    await coursesStore.asyncSetIsStudentEnroll(1);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isStudentEnrolled).toBe(true);

    vi.spyOn(courseApi, "postEnrollStudent").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsStudentEnroll(1);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isStudentEnrolled).toBe(false);
  });

  it("should handle leave student success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "deleteStudent").mockResolvedValue("Success");
    await coursesStore.asyncSetIsStudentLeave(1);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isStudentLeft).toBe(true);

    vi.spyOn(courseApi, "deleteStudent").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsStudentLeave(1);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isStudentLeft).toBe(false);
  });

  // Rating
  it("should handle submit rating success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "putCourseRating").mockResolvedValue("Success");
    await coursesStore.asyncSetIsRatingSubmit(1, 5, "Good");
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isRatingSubmitted).toBe(true);

    vi.spyOn(courseApi, "putCourseRating").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsRatingSubmit(1, 5, "Good");
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isRatingSubmitted).toBe(false);
  });

  // Content
  it("should handle asyncSetContent success and failure", async () => {
    const content = { id: 10, title: "Materi", youtube: "yt" };
    vi.spyOn(courseApi, "getCourseContentById").mockResolvedValue(content);

    await coursesStore.asyncSetContent(10);
    expect(coursesStore.content).toEqual(content);
    expect(coursesStore.isContent).toBe(true);

    vi.spyOn(courseApi, "getCourseContentById").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetContent(99);
    expect(coursesStore.content).toBeNull();
  });

  it("should handle add content success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "postCourseContent").mockResolvedValue("Success");
    await coursesStore.asyncSetIsContentAdd(1, "Title", "yt");
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isContentAdded).toBe(true);

    vi.spyOn(courseApi, "postCourseContent").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsContentAdd(1, "Title", "yt");
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isContentAdded).toBe(false);
  });

  it("should handle change content success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "putCourseContent").mockResolvedValue("Success");
    await coursesStore.asyncSetIsContentChange(10, "Title", "yt");
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isContentChanged).toBe(true);

    vi.spyOn(courseApi, "putCourseContent").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsContentChange(10, "Title", "yt");
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isContentChanged).toBe(false);
  });

  it("should handle delete content success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "deleteCourseContent").mockResolvedValue("Success");
    await coursesStore.asyncSetIsContentDelete(10);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isContentDeleted).toBe(true);

    vi.spyOn(courseApi, "deleteCourseContent").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsContentDelete(10);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isContentDeleted).toBe(false);
  });

  it("should handle update learn status success and failure", async () => {
    const succSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
    const errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    vi.spyOn(courseApi, "postContentLearnStatus").mockResolvedValue("Success");
    await coursesStore.asyncSetIsLearnStatusChange(10, 1);
    expect(succSpy).toHaveBeenCalled();
    expect(coursesStore.isLearnStatusChanged).toBe(true);

    vi.spyOn(courseApi, "postContentLearnStatus").mockRejectedValue(new Error("Fail"));
    await coursesStore.asyncSetIsLearnStatusChange(10, 1);
    expect(errSpy).toHaveBeenCalledWith("Fail");
    expect(coursesStore.isLearnStatusChanged).toBe(false);
  });
});

