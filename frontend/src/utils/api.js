import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/canvas";

export const updateCanvas = async (canvasId, elements) => {
  try {
    const token = localStorage.getItem("whiteboard_user_token");
    const response = await axios.put(
      `${API_BASE_URL}/update`,
      { canvasId, elements },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Canvas saved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating canvas:", error);
  }
};
