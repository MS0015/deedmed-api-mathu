'use strict';
const { models: { Appointment, Doctor, Patient } } = require('../../../lib/models/index');
const { Op } = require('sequelize');
const { APPOINTMENT_STATUS } = require('../../../lib/constant');

class AdminAppointmentRepository {

  static async getByPatientId(patientId, offset, limit) {
    try {
      const result = await Appointment.findAll({
        where: { patientId },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getByPatientIdCount(patientId);
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByPatientIdCount(patientId) {
    try {
      return await Appointment.count({ where: { patientId } });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByDoctorId(doctorId, offset, limit) {
    try {
      const result = await Appointment.findAll({
        where: { doctorId },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getByDoctorIdCount(doctorId);
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByDoctorIdCount(doctorId) {
    try {
      return await Appointment.count({ where: { doctorId } });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAll(offset, limit) {
    try {
      const result = await Appointment.findAll({
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getAllCount();
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllCount() {
    try {
      return await Appointment.count();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllPast(offset, limit, date, slot) {
    try {
      const result = await Appointment.findAll({
        where: {
          [Op.and]: [
            {
              status: {
                [Op.ne]: APPOINTMENT_STATUS.ONGOING,
              }
            },
            {
              date: {
                [Op.lt]: date
              }
            },
            {
              slotTime: {
                [Op.lt]: slot
              }
            }
          ]
        },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getAllPastCount(date, slot);
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllPastCount(date, slot) {
    try {
      return await Appointment.count({
        where: {
          [Op.and]: [
            {
              status: {
                [Op.ne]: APPOINTMENT_STATUS.ONGOING,
              }
            },
            {
              date: {
                [Op.lt]: date
              }
            },
            {
              slotTime: {
                [Op.lt]: slot
              }
            }
          ]
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllPresent(offset, limit, dateOnlyForNow, timeOnlyForNow, dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow) {
    try {
      const result = await Appointment.findAll({
        where: {
          [Op.and]: [
            {
              date: {
                [Op.gte]: dateOnlyForNow,
                [Op.lte]: dateOnlyFromThirtyMinutesNow
              }
            },
            {
              slotTime: {
                [Op.gte]: timeOnlyForNow,
                [Op.lte]: timeOnlyFromThirtyMinutesNow
              }
            }
          ]
        },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getAllPresentCount(dateOnlyForNow, timeOnlyForNow, dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow);
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllPresentCount(dateOnlyForNow, timeOnlyForNow, dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow) {
    try {
      return await Appointment.count({
        where: {
          [Op.and]: [
            {
              date: {
                [Op.gte]: dateOnlyForNow,
                [Op.lte]: dateOnlyFromThirtyMinutesNow
              }
            },
            {
              slotTime: {
                [Op.gte]: timeOnlyForNow,
                [Op.lte]: timeOnlyFromThirtyMinutesNow
              }
            }
          ]
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllFuture(offset, limit, dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow) {
    try {
      const result = await Appointment.findAll({
        where: {
          [Op.or]: [
            {
              date: {
                [Op.gt]: dateOnlyFromThirtyMinutesNow
              }
            },
            {
              date: {
                [Op.eq]: dateOnlyFromThirtyMinutesNow
              },
              slotTime: {
                [Op.gt]: timeOnlyFromThirtyMinutesNow
              }
            }
          ]
        },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        include: [
          {
            model: Doctor,
            attributes: {
              exclude: ['UserUserId']
            },
          },
          {
            model: Patient,
            attributes: {
              exclude: ['UserUserId']
            },
          }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      });
      const dataCount = await this.getAllFutureCount(dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow);
      return Promise.resolve({ data: result, dataCount });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllFutureCount(dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow) {
    try {
      return await Appointment.count({
        where: {
          [Op.or]: [
            {
              date: {
                [Op.gt]: dateOnlyFromThirtyMinutesNow
              }
            },
            {
              date: {
                [Op.eq]: dateOnlyFromThirtyMinutesNow
              },
              slotTime: {
                [Op.gt]: timeOnlyFromThirtyMinutesNow
              }
            }
          ]
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getAllFuturePendingWithoutOffsetLimit(dateOnlyFromThirtyMinutesNow, timeOnlyFromThirtyMinutesNow) {
    try {
      const appointments = await Appointment.findAll({
        where: {
          [Op.and]: [
            {
              status: APPOINTMENT_STATUS.PENDING
            },
            {
              [Op.or]: [
                {
                  date: {
                    [Op.gt]: dateOnlyFromThirtyMinutesNow
                  }
                },
                {
                  date: {
                    [Op.eq]: dateOnlyFromThirtyMinutesNow
                  },
                  slotTime: {
                    [Op.gt]: timeOnlyFromThirtyMinutesNow
                  }
                }
              ]
            }
          ]
        },
        attributes: {
          exclude: ['DoctorDoctorId', 'PatientPatientId']
        },
        order: [
          ['createdAt', 'DESC']
        ]
      });
      return Promise.resolve(appointments);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = AdminAppointmentRepository;
