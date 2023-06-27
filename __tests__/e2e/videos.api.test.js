"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
const constants_1 = require("../../src/repositories/constants");
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete('/__test__/data');
    }));
    it('should return 200 and array with two objects', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(constants_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos/999999')
            .expect(constants_1.HTTP_STATUSES.NOT_FOUND);
    }));
    it(`should'nt create video with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({ title: '' })
            .expect(constants_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(constants_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdVideo = null;
    it(`should create video with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'it-incubator',
            author: 'Vasia',
            availableResolutions: [
                "P144"
            ]
        })
            .expect(constants_1.HTTP_STATUSES.CREATED_201);
        createdVideo = createResponse.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'it-incubator',
            author: 'Vasia',
            canBeDownloaded: true,
            minAgeRestriction: 15,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: [
                "P144"
            ]
        });
    }));
    it(`should'nt update video with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .put('/videos' + createdVideo.id)
            .send({
            title: 'it-incubator updated 1',
            author: 'Vasia Vasia 1',
            availableResolutions: [
                "P144"
            ]
        })
            .expect(constants_1.HTTP_STATUSES.NOT_FOUND);
    }));
    it(`should update created video with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'it-incubator updated',
            author: 'Vasia updated',
            availableResolutions: [
                "P144"
            ]
        })
            .expect(constants_1.HTTP_STATUSES.CREATED_201);
        createdVideo = createResponse.body;
        console.log('CreaTEDvIDEO ', createdVideo);
        const putResponse = yield (0, supertest_1.default)(src_1.app)
            .put(`/videos/${createdVideo.id}`)
            .expect(constants_1.HTTP_STATUSES.NO_CONTENT_204);
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'it-incubator updated',
            author: 'Vasia updated',
            canBeDownloaded: true,
            minAgeRestriction: 15,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: [
                "P144"
            ]
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos/' + createdVideo.id)
            .expect(constants_1.HTTP_STATUSES.OK_200, createdVideo);
    }));
    it(`should delete created video with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'it-incubator',
            author: 'Vasia',
            availableResolutions: [
                "P144"
            ]
        })
            .expect(constants_1.HTTP_STATUSES.CREATED_201);
        createdVideo = createResponse.body;
        const getResponse = yield (0, supertest_1.default)(src_1.app)
            .get(`/videos/${createdVideo.id}`)
            .expect(constants_1.HTTP_STATUSES.OK_200);
        expect(getResponse.body).toEqual(createdVideo);
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/videos/${createdVideo.id}`)
            .expect(constants_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/videos/${createdVideo.id}`)
            .expect(constants_1.HTTP_STATUSES.NOT_FOUND);
    }));
});
