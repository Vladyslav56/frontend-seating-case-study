import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { useUser } from "./providers/UserProvider"

interface HeaderProps {
	onLoginClick: () => void
}

function Header({ onLoginClick }: HeaderProps) {
	const { user, logout } = useUser()

	return (
		<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
				{/* application/author image/logo placeholder */}
				<div className="max-w-[250px] w-full flex">
					<div className="bg-zinc-100 rounded-md size-12" />
				</div>
				{/* app/author title/name placeholder */}
				<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
				{/* user menu */}
				<div className="max-w-[250px] w-full flex justify-end">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost">
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`}
											/>
											<AvatarFallback>
												{user.firstName[0]}
												{user.lastName[0]}
											</AvatarFallback>
										</Avatar>

										<div className="flex flex-col text-left">
											<span className="text-sm font-medium">
												{user?.firstName} {user?.lastName}
											</span>
											<span className="text-xs text-zinc-500">
												{user?.email}
											</span>
										</div>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[250px]">
								<DropdownMenuLabel>
									{user?.firstName} {user?.lastName}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={() => logout()}>
										Logout
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button onClick={onLoginClick} variant="secondary">
							Login or register
						</Button>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Header
