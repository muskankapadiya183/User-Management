// import axios from "axios";
export const register_me = async formData => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    )
    const data = res.json()
    return data
  } catch (error) {
  }
}

export const login_me = async formData => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    )
    const data = res.json()
    return data
  } catch (error) {
    console.log("error in login (service) => ", error)
  }
}

export const logout_me = async formData => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user_logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    )
    const data = res.json()
    return data
  } catch (error) {
    console.log("error in login (service) => ", error)
  }
}
