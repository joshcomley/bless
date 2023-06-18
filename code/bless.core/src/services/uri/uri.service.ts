export class UriService {
    public static GetQueryParameter(name: string, url: string = undefined): string {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // See: https://stackoverflow.com/a/11654596/64519
    public static SetQueryParameter(url: string, key: string, value: string): string {
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;
        if (re.test(url)) {
            if (typeof value !== "undefined" && value !== null)
                return url.replace(re, "$1" + key + "=" + value + "$2$3");
            else {
                hash = url.split("#");
                url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
                if (typeof hash[1] !== "undefined" && hash[1] !== null) {
                    url += "#" + hash[1];
                }
            }
        }
        else {
            if (typeof value !== "undefined" && value !== null) {
                var separator = url.indexOf("?") !== -1 ? "&" : "?";
                hash = url.split("#");
                url = hash[0] + separator + key + "=" + value;
                if (typeof hash[1] !== "undefined" && hash[1] !== null) {
                    url += "#" + hash[1];
                }
            }
        }
        return url;
    }
}