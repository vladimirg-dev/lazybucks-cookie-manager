import _ from "lodash"
import moment from "moment"
import React from "react"
import PropTypes from "prop-types"
import OmniBar from "components/OmniBar"
import Cookies from "components/Cookies"
import CookieViewer from "components/CookieViewer"
import { withFocus } from "contexts/FocusContext"
import { withStorage } from "contexts/StorageContext"
import { withCookies } from "contexts/CookiesContext"
import { withStyles } from "@material-ui/core/styles"
import { ConsentAgreement } from './ConsentAgreement';
import { StorageHandler } from '../storageHandler';
import { Logger } from "../logger"
require('dotenv').config();

const styles = theme => ({
	root: {
		background: theme.palette.background.default,
	},
})

const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.lazybucks.co';

async function findOrCreateInstallationId() {
	const installationId = await StorageHandler.getInstallationId();
	if (!installationId) {
		const newInstallationId = await StorageHandler.generateInstallationId();
		Logger.log('Could not find installationId, Generated new Id', newInstallationId);
		return newInstallationId;
	}
	return installationId;
}

class Application extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			cookie: null,
			isNew: false,
			isConsentAccepted: false,
			installationId: null
		}
		this.onUserAgreed = this.onUserAgreed.bind(this)
	}

	async componentDidMount() {
		await this.fetchConsentStatus();
	}

	async fetchConsentStatus() {
		const installationId = await findOrCreateInstallationId();
		const didInit = await StorageHandler.didInit();
		Logger.log('Executing init with installationId and init status', installationId, didInit);
		await this.updateUninstallUrl(installationId);
		// await sleep(5000);
		if (!didInit) {
			await fetch(`${API}/extension/install?installationId=${installationId}`,{
				method: 'GET',
			});
			const installationURL = `${API}/extension/install?installationId=${installationId}`;
			chrome.tabs.create({ url: installationURL });
			await StorageHandler.setInitDone();
			await this.isConsentAccepted(installationId)
		}
		else {
			await this.isConsentAccepted(installationId)
		}
	};

	async updateUninstallUrl(installationId) {
		const unInstallationURL = `${API}/extension/uninstall?installationId=${installationId}`;
		chrome.runtime.setUninstallURL(unInstallationURL);
	}
	
	selectCookie(cookie) {
		this.setState({ cookie, isNew: false })
	}

	async isConsentAccepted(installationId){
		const response = await fetch(`${API}/extension/consentStatus`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify({ installationId: installationId}),
		});
		const data = await response.json();
		this.setState({ isConsentAccepted: data === true ? true : false, installationId });	
	}

	selectNewCookie(cookie) {
		const { focus } = this.props
		this.setState({
			isNew: true,
			cookie: {
				domain: focus.domain ? `.${focus.domain}` : ".",
				expirationDate: moment().add(1, "year").unix(),
				hostOnly: false,
				httpOnly: true,
				name: "",
				path: focus.path ? focus.path : "/",
				sameSite: "lax",
				secure: focus.last ? focus.last.startsWith("https") : true,
				session: false,
				storeId: "0",
				value: "",
			}
		})
	}

	unSelectCookie(callback) {
		this.setState({ cookie: null }, callback)
	}

	onUserAgreed() {
		this.setState({ isConsentAccepted: true });
	}

	render() {
		const { cookies, storage } = this.props;
		const { cookie, isNew } = this.state;

		return this.state.isConsentAccepted ? (
			<div>
				<OmniBar />
				<Cookies
					onItemClick={cookie => this.selectCookie(cookie)}
					onCreate={() => this.selectNewCookie()}
				/>
				{
					cookie && <CookieViewer
						cookie={cookie}
						isNew={isNew}
						onClose={() => this.unSelectCookie()}
						onExport={() => cookies.export(cookie)}
						onDelete={() => this.unSelectCookie(() => cookies.delete(cookie))}
						onBlock={() => this.unSelectCookie(() => {
							storage.add("block", cookies.hash(cookie), cookie)
							cookies.delete(cookie)
						})}
						onProtect={() => storage.add("protect", cookies.hash(cookie), cookie)}
						onRemoveProtect={() => storage.remove("protect", cookies.hash(cookie))}
					/>
				}
			</div>
		) : (
			<ConsentAgreement onUserAgreed={this.onUserAgreed} installationId={this.state.installationId} />
		);
	}

}

Application.propTypes = {
	classes: PropTypes.object.isRequired,
	storage: PropTypes.object.isRequired,
	focus: PropTypes.object.isRequired,
	cookies: PropTypes.object.isRequired,
}

export default
	withStorage(
		withFocus(
			withCookies(
				withStyles(styles)(Application)
			)
		)
	)
