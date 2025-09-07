import { Button, buttonVariants } from "@/components/ui/button";
<<<<<<< HEAD
import UserButton from "@/modules/auth/components/user-button";
import { User } from "lucide-react";
import Image from "next/image";

export default async function Home() {

=======
import Image from "next/image";

export default function Home() {
>>>>>>> e2ec2f644d538822c65cf5d61c11ea2cb26cb473
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Button>
        Get Started
      </Button>
<<<<<<< HEAD
      <UserButton />
=======
>>>>>>> e2ec2f644d538822c65cf5d61c11ea2cb26cb473
    </div>
  );
}
