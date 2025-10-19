"use server";
import axios from "axios";

interface IToken {
  accessToken: string;
  accessTokenExpiresAt: Date | undefined;
  scopes: string[];
  idToken: string | undefined;
}

export const checkScope = async (accessToken: IToken) => {
  try {
    if (!accessToken) throw new Error("access token is not present");
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/tokeninfo",
      { params: { access_token: accessToken.accessToken } }
    );
    const data = response.data;
    const scopes = data.scope?.split(" ") ?? [];
    const calendarScope = "https://www.googleapis.com/auth/calendar";
    const hasScope = scopes.includes(calendarScope);
    return hasScope;
  } catch (error) {
    console.error(error);
    return {
      message: "failed to check scope",
    };
  }
};
