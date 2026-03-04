"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatusHistory = void 0;
const typeorm_1 = require("typeorm");
const reports_entity_1 = require("./reports.entity");
const users_entity_1 = require("../users/users.entity");
let ReportStatusHistory = class ReportStatusHistory {
};
exports.ReportStatusHistory = ReportStatusHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportStatusHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_id', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], ReportStatusHistory.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reports_entity_1.Report, (report) => report.statusHistory, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", reports_entity_1.Report)
], ReportStatusHistory.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_status', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ReportStatusHistory.prototype, "oldStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_status', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ReportStatusHistory.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], ReportStatusHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.reportStatusChanges, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", users_entity_1.User)
], ReportStatusHistory.prototype, "changedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ReportStatusHistory.prototype, "changedAt", void 0);
exports.ReportStatusHistory = ReportStatusHistory = __decorate([
    (0, typeorm_1.Entity)('report_status_history')
], ReportStatusHistory);
