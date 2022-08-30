const React = require('react');
const Avatar = require('boring-avatars').default;
const { renderToString } = require('react-dom/server');
import { getEmail, getUserHash} from "../../utils/auth";


export default async function handler(req, res) {

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    var name = req.query.userhash || getUserHash(getEmail(req.query.token))

    const svg = renderToString(
        React.createElement(Avatar, {
            size: 120,
            name: name,
            variant: "beam",
            colors: ['#C1DDC7', '#F5E8C6', '#BBCD77', '#DC8051', '#F4D279'],
            square: false,
        }, null)
    );
    res.end(svg);
}