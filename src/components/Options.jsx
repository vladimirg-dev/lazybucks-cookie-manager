import browser from "webextension-polyfill"
import utils from "utils/cookie"
import React from "react"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import Divider from "@material-ui/core/Divider"
import Switch from "@material-ui/core/Switch"
import Select from "@material-ui/core/Select"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import SearchIcon from "@material-ui/icons/Search"
import SecurityIcon from "@material-ui/icons/Security"
import BlockIcon from "@material-ui/icons/Block"
import PaletteIcon from "@material-ui/icons/Palette"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import SpecialThanksIcon from "@material-ui/icons/Favorite"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import MenuItem from "@material-ui/core/MenuItem"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Logo from "icons/Logo"
import TableList from "components/TableList"
import Credits from "components/Credits"
import { withStorage } from "contexts/StorageContext"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
	root: {
		display: "flex",
		flexDirection: "column",
		flexWrap: "no-wrap",
		height: "100vh",
		background: theme.palette.background.default,
		minWidth: 850,
	},
	app: {
		background: theme.palette.background.paper,
	},
	title: {
		padding: theme.spacing ( 0, 1.5 ),
		flex: 1,
	},
	version: {
		cursor: "pointer",
		"&:hover": {
			opacity: 0.5,
		},
	},
	bottom: {
		display: "flex",
		flex: 1,
	},
	menu: {
		height: "calc( 100vh - 64px )",
		minWidth: 300,
		overflowY: "auto",
	},
	list: {
		marginTop: theme.spacing ( 2 ),
		marginBottom: theme.spacing ( 2 ),
	},
	toolbar: {
		display: "flex",
		borderBottom: `solid 1px ${theme.palette.divider}`,
		padding: theme.spacing ( 0, 1.5 ),
	},
	icon: {
		padding: 0,
	},
	logo: {
		color: theme.palette.primary.main,
		fontSize: 28,
	},
	content: {
		height: "calc( 100vh - 64px )",
		flex: 1,
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		[theme.breakpoints.up ("lg")]: {
			paddingRight: 300,
		},
		overflowY: "scroll",
	},
	summary: {
		alignItems: "center",
		justifyContent: "space-between",
	},
	container: {
		maxWidth: 680,
		padding: theme.spacing ( 0, 4, 4, 4 ),
		overflowY: "auto",
		boxSizing: "content-box",
		marginTop: theme.spacing ( -1 ),
	},
	section: {
		margin: theme.spacing ( 1, 0, 0, 0 ),
		padding: theme.spacing ( 3, 0, 4, 0 ),
		fontWeight: 400,
	},
	paragraph: {
		margin: theme.spacing ( -3, 0, 4, 0 ),
	},
	madeWith: {
		width: "100%",
		height: 30,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginTop: "calc( 100vh - 120px )",
		color: theme.palette.text.secondary,
		"& p": {
			margin: 0,
			marginRight: 3,
		},
		"& span": {
			color: theme.palette.error.main,
			marginLeft: 3,
			marginRight: 3,
		},
		"& a": {
			color: theme.palette.text.secondary,
			textDecoration: "none",
		},
	},
	noMargin: {
		margin: 0,
	},
	table: {
		overflow: "auto",
	},
})

class Options extends React.Component {

	constructor ( props ) {
		super ( props )
		this.state = {
			dialog: {
				open: false,
				title: "Confirm",
				description: "Are you sure you want to proceed?",
				cancel_label: "Nevermind",
				cancel_callback: () => this.handleDialogClose (),
				submit_label: "Yes",
				submit_callback: () => this.handleDialogClose (),
			},
		}
	}

	setDialogState ( options, callback = () => {} ) {
		this.setState ( state => ({
			dialog: {
				...state.dialog,
				...options,
			},
		}), callback )
	}

	handleDialogClose ( callback = () => {} ) {
		this.setDialogState ( { open: false }, callback )
	}

	render () {
		const { classes, storage, data } = this.props
		const { dialog } = this.state
		return <div className={classes.root} >
			<Dialog onClose={() => this.handleDialogClose ()} open={dialog.open} >
				<DialogTitle onClose={() => this.handleDialogClose ()} >
					<b>{dialog.title}</b>
				</DialogTitle>
				<DialogContent dividers >
					<Typography gutterBottom >
						{dialog.description}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={() => dialog.cancel_callback ()} color="primary" >
						{dialog.cancel_label}
					</Button>
					<Button onClick={() => dialog.submit_callback ()} color="primary" >
						{dialog.submit_label}
					</Button>
				</DialogActions>
			</Dialog>
			<AppBar className={classes.app} position="relative" color="inherit" elevation={0} >
				<Toolbar className={classes.toolbar} disableGutters >
					<IconButton
						className={classes.icon}
						disabled={true}
						size="small"
						color="primary" >
						<Logo viewBox="0 0 48 48" fontSize="inherit" className={classes.logo} />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						className={classes.title} >
						<b>LazyBucks</b> — Cookie Manager — Options
					</Typography>
					<Typography
						className={classes.version}
						variant="overline"
						color="textSecondary"
						noWrap
						onClick={() => browser.tabs.create ({
							url: 'https://app.lazybucks.co/users'
						})} >
						version {process.env.npm_package_version}
					</Typography>
				</Toolbar>
			</AppBar>
			<div className={classes.bottom} >
				<nav className={classes.menu} >
					<List className={classes.list} >
						<ListItem button onClick={() => window.location = "#search-settings"} >
							<ListItemIcon>{<SearchIcon/>}</ListItemIcon>
							<ListItemText primary="Search Settings" />
						</ListItem>
						<ListItem button onClick={() => window.location = "#appearance"} >
							<ListItemIcon>{<PaletteIcon/>}</ListItemIcon>
							<ListItemText primary="Appearance" />
						</ListItem>
						<ListItem button onClick={() => window.location = "#blocked-cookies"} >
							<ListItemIcon>{<BlockIcon/>}</ListItemIcon>
							<ListItemText primary="Blocked Cookies" />
						</ListItem>
						<ListItem button onClick={() => window.location = "#protected-cookies"} >
							<ListItemIcon>{<SecurityIcon/>}</ListItemIcon>
							<ListItemText primary="Protected Cookies" />
						</ListItem>
						<ListItem button onClick={() => window.location = "#special-thanks"} >
							<ListItemIcon>{<SpecialThanksIcon/>}</ListItemIcon>
							<ListItemText primary="Special Thanks" />
						</ListItem>
					</List>
				</nav>
				<main className={classes.content} >
					<div className={classes.container} >
						<Typography id="search-settings" className={classes.section} variant="h6" >Search Settings</Typography>
						<Typography className={classes.paragraph} color="textSecondary" >
							These settings are stored locally and are not synced across browsers.
							Case sensitivity applies to both regular and regexp search.
						</Typography>
						<div>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Case Sensitive</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.sensitive}
										onChange={e => storage.set ( "sensitive", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Search With Regular Expression</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.regexp}
										onChange={e => storage.set ( "regexp", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
						</div>
						<Typography id="appearance" className={classes.section} variant="h6" >Appearance</Typography>
						<Typography className={classes.paragraph} color="textSecondary" >
							Unfortunately Chrome extensions cannot detect if your system is using a Dark theme.
							Thankfully, there is still a dark mode that you can set manually!
						</Typography>
						<div>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Dark Mode</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.dark}
										onChange={e => storage.set ( "dark", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Show Tooltips</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.tooltips}
										onChange={e => storage.set ( "tooltips", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Show Warning Dialogs</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.showWarnings}
										onChange={e => storage.set ( "showWarnings", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Context Menu</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.contextMenu}
										onChange={e => storage.set ( "contextMenu", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: classes.summary }} >
									<Typography>Update Protected Cookie's Value</Typography>
									<Switch
										color="primary"
										size="small"
										checked={storage.data.updateProtectedValue}
										onChange={e => storage.set ( "updateProtectedValue", e.target.checked )}
									/>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: `${classes.summary} ${classes.noMargin}` }} >
									<Typography>Expiration Time Format</Typography>
									<Select
										disableUnderline
										size="small"
										value={storage.data.expirationFormat}
										onChange={e => storage.set ( "expirationFormat", e.target.value )} >
										<MenuItem value={"humanized"}>Humanized</MenuItem>
										<MenuItem value={"countdown"}>Countdown</MenuItem>
										<MenuItem value={"timestamp"}>Timestamp</MenuItem>
										<MenuItem value={"seconds"}>Seconds</MenuItem>
									</Select>
								</AccordionSummary>
							</Accordion>
							<Accordion elevation={2} expanded={false} >
								<AccordionSummary classes={{ content: `${classes.summary} ${classes.noMargin}` }} >
									<Typography>Sort Cookie List</Typography>
									<div>
										<Select
											disableUnderline
											size="small"
											value={storage.data.sortType}
											style={{ marginRight: 10 }}
											onChange={e => storage.set ( "sortType", e.target.value )} >
											<MenuItem value={"name"}>Name</MenuItem>
											<MenuItem value={"domain"}>Domain</MenuItem>
											<MenuItem value={"expirationDate"}>Expiration</MenuItem>
										</Select>
										<Select
											disableUnderline
											size="small"
											value={storage.data.sortDirection}
											onChange={e => storage.set ( "sortDirection", e.target.value )} >
											<MenuItem value={"ascending"}>Ascending</MenuItem>
											<MenuItem value={"descending"}>Descending</MenuItem>
										</Select>
									</div>
								</AccordionSummary>
							</Accordion>
						</div>
						<Typography id="blocked-cookies" className={classes.section} variant="h6" >Blocked Cookies</Typography>
						<Typography className={classes.paragraph} color="textSecondary" >
							When a cookie is blocked, the name, domain, and path is saved and is used to block future cookies from being created.
							All three properties must match exactly for a cookie to be blocked.
						</Typography>
						<div>
							<Accordion elevation={2} expanded={false} className={classes.table} >
								<TableList
									items={storage.data.block}
									itemKey={item => utils.hash ( item )}
									onTruncate={
										storage.data.showWarnings
										? () => this.setDialogState ({
											open: true,
											title: "Truncate Blocked Cookies",
											description: "Are you sure you want to remove all blocked cookie patterns? This action cannot be undone.",
											submit_callback: () => storage.set ( "block", {} ).then ( () => this.handleDialogClose () ),
										})
										: () => storage.set ( "block", {} ).then ( () => this.handleDialogClose () )
									}
									noItemsMessage="No Blocked Cookies"
									columns={{
										"Name": item => item.name,
										"Domain + Path": item => item.domain + item.path,
										"": item => <Button
											size="small"
											onClick={() => storage.remove ( "block", utils.hash ( item ) )} >
											unblock
										</Button>,
									}}
								/>
							</Accordion>
						</div>
						<Typography id="protected-cookies" className={classes.section} variant="h6" >Protected Cookies</Typography>
						<Typography className={classes.paragraph} color="textSecondary" >
							Protected cookies are indexed by their name, domain, and path.
							Their expiration is respected but deletion & modification is prevented.
							If a new cookie is set with the same name, domain, and path after a protected cookie expires, then that cookie will automatically be protected.
						</Typography>
						<div>
							<Accordion elevation={2} expanded={false} className={classes.table} >
								<TableList
									items={storage.data.protect}
									itemKey={item => utils.hash ( item )}
									onTruncate={
										storage.data.showWarnings
										? () => this.setDialogState ({
											open: true,
											title: "Truncate Protected Cookies",
											description: "Are you sure you want to remove all protected cookie patterns? This action cannot be undone.",
											submit_callback: () => storage.set ( "protect", {} ).then ( () => this.handleDialogClose () ),
										})
										: () => storage.set ( "protect", {} ).then ( () => this.handleDialogClose () )
									}
									noItemsMessage="No Protected Cookies"
									columns={{
										"Name": item => item.name,
										"Domain + Path": item => item.domain + item.path,
										"": item => <Button
											size="small"
											onClick={() => storage.remove ( "protect", utils.hash ( item ) )} >
											release
										</Button>,
									}}
								/>
							</Accordion>
						</div>
						<Typography id="special-thanks" className={classes.section} variant="h6" >Special Thanks</Typography>
						<Typography className={classes.paragraph} color="textSecondary" >
							Thank you to all the open-source resources that were available to make this project possible!
						</Typography>
						<div>
							<Accordion elevation={2} expanded={false} >
								<Credits/>
							</Accordion>
						</div>
						<Typography className={classes.madeWith} variant="overline" >
							Coded With
							<span>❤</span>
							<p>By</p>
							<a href="https://github.com/null93" target="_blank" >Rafael Grigorian</a>
						</Typography>
					</div>
				</main>
			</div>
		</div>
	}

}

Options.propTypes = {
	classes: PropTypes.object.isRequired,
	storage: PropTypes.object.isRequired,
}

export default
withStorage (
	withStyles ( styles ) ( Options )
)
