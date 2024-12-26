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
import logo from "./img/nfctron-logo-dark.svg"
import { useTranslation } from "react-i18next"
import { changeLanguage } from "i18next"

// Props interface
interface HeaderProps {
	onLoginClick: () => void
}

function Header({ onLoginClick }: HeaderProps) {
	// User context and translation hooks
	const { t, i18n } = useTranslation()
	const { user, logout } = useUser()

	return (
		<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-around">
			{/* inner content */}
			<div className="max-w-screen-lg p-4 grow flex items-center justify-around gap-6 flex-wrap">
				{/* Logo */}
				<div className="max-w-[250px] sm:w-20 flex">
					<img src={logo} alt="logo" />
				</div>
				{/* Title */}
				<div className="text-zinc-900 ">NFCtron Keynote</div>
				{/* Language switcher */}
				<div>
					<Button
						variant={i18n.language === "en" ? "default" : "ghost"}
						onClick={() => changeLanguage("en")}
					>
						EN
					</Button>
					<Button
						variant={i18n.language === "cz" ? "default" : "ghost"}
						onClick={() => changeLanguage("cz")}
					>
						CZ
					</Button>
				</div>
				{/* User menu */}
				<div className="max-w-[250px] flex justify-end">
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
										{t("logout")}
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						// Login button
						<Button onClick={onLoginClick} variant="secondary">
							{t("login")}
						</Button>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Header
