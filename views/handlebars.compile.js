const config = {
    entryPoints: ['index.hbs'
    ],
    partials: ['./partials/tomain.hbs'
    ],
    data: {
        message: 'Hello , World!'
    },
    helpers: [
    ],
    setup: (handlebars) => {
    }
};

(async function doWork(configuration) {
    const { promises: _fs } = require("fs");
    const _path = require('path');

    const getBaseFileName = (filePath) => _path.basename(filePath, _path.extname(filePath));

    async function requireGlobal(id) {
        const getNpmRoot = new Promise((resolve, reject) => {
            require("child_process").exec("npm root -g", (err, stdout, stderr) => {
                if (err) { reject(err.message); }
                else if (stderr) { reject(stderr); }
                else { resolve(stdout.trim()); }
            });
        });

        try {
            const npmRoot = await getNpmRoot;
            const packagePath = _path.resolve(`${npmRoot}/${id}`);
            return require(packagePath);
        }
        catch (e) {
            throw `Can not find global installed ${id}. Exception: ${e.message}`;
        }

    }

    function addHelper(helper, hbs) {
        if (helper && typeof helper.register === 'function') {
            helper.register(hbs);
        }
        else {
            console.error(`WARNING: helper have not a 'register' function, cannot add`);
        }
    }

    function resolveFile(filePath) {
        const absolutePath = _path.resolve(__dirname, filePath);
        console.info(`Load file from ${absolutePath}`);
        return _fs.readFile(absolutePath, "utf8");
    }

    async function addPartial(input, hbs) {
        const partial = await resolveFile(input);
        hbs.registerPartial(getBaseFileName(input), partial);
    }

    async function renderTemplate(input, context, hbs) {
        const template = await resolveFile(input);
        const hbsRender = hbs.compile(template);
        const htmlContents = hbsRender(context);
        const entryPointDir = _path.dirname(input);
        const output = _path.resolve(entryPointDir, `${getBaseFileName(input)}.html`);
        await _fs.writeFile(output, htmlContents, 'utf8');
        console.info(`Wrote ${output}`);
    }

    async function compile({
        entryPoints = ['index.hbs'],
        partials = [],
        data = {},
        helpers = [],
        setup = (handlebars) => { }
    }) {

        const Handlebars = await requireGlobal('handlebars');

        setup(Handlebars);

        helpers.forEach(helper => addHelper(helper, Handlebars));

        await Promise.all(partials.map(fileName => addPartial(fileName, Handlebars)));
        await Promise.all(entryPoints.map(fileName => renderTemplate(fileName, data, Handlebars)));
    }

    try {
        await compile(configuration);
        console.info("Done!")
    }
    catch (e) {
        console.error(e);
    }
})(config);
