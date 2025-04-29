import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { fetchGitHubUserData } from "@/lib/github";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get current session
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("session:", session);

    // Get user from database
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    console.log("session", session);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { tagline } = await req.json();
    // const githubData = await fetchGitHubUserData(session.accessToken);

    // Update user in database
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        // ...githubData,
        tagline: tagline || "", // Add custom tagline if provided
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error : any) {
    console.error("Error updating profile:", error.response);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
