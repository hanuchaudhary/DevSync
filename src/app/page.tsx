import { getServerSession } from "next-auth";
import Link from "next/link";
import { LoginButton } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import { Code, Sparkles, Users } from "lucide-react";


export default async function Home() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;
  
  return (
    <div className="container mx-auto">
      {/* Hero section */}
      <section className="py-12 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Find Your Perfect Coding Partner
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          DevMatch connects developers using GitHub profiles. Swipe, match, and collaborate with developers who share your programming language, activity level, and interests.
        </p>
        
        {isLoggedIn ? (
          <Link href="/swipe">
            <Button size="lg" className="gap-2">
              <Users size={18} />
              Start Matching
            </Button>
          </Link>
        ) : (
          <LoginButton />
        )}
      </section>
      
      {/* Features section */}
      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
          <p className="text-muted-foreground">
            We analyze your GitHub profile to match you with developers who share your technology stack and interests.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
          <p className="text-muted-foreground">
            Our algorithm considers programming languages, activity level, project interests, and location.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect & Collaborate</h3>
          <p className="text-muted-foreground">
            Match with potential collaborators, chat within the app, and start building amazing projects together.
          </p>
        </div>
      </section>
    </div>
  );
}